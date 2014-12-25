// Experiment with a mixin-heavy version of mutt

/*
Have Scene object, which has a render(view_id) fn
Scene object also keeps track of id->obj map and handles queries, etc.
Views have draw(transform, scene, context??) and clear(...) fns
Scene just calls draw(identity, ...) on passed view?

- minimal work to get to graphical display:
  1) mock transform's "transform_pt" thing so it just returns the same point...
  2) have rendering thing that tracks transform stack and root of scene graph
     at each layer, rendering thing will pass current transform to things
     to be rendered
     ...wait, what to do about views, etc. when rendering?
  3) use already implemented entities

Nice if Entity can defer more things to Style - like Style can optionally
implement a 'contains' function, and Entity will check before using the default
one.
*/


class Point {

}

class Transform {
  apply...;
  // just use paper.js's matrix stuff for now?
}

/* Transformable mixin

 */
class Transformable {
  origin;
  translation;
  rotation;
  scale;
  skew;
  set_pos(...);
  move(...);
  to_local_coords(pt);
  from_local_coords(pt, transform?);
  // how to deal with propagating transform through hierarchy?
  // could have something in here...that takes Hierarchical things
  // ideally don't have to re-do all the multiplications each time want to
  // render something....
  // if only call draw on children, then can just pass them the current
  // transform...then they add in their own transform and pass transform on...
  // so I guess should have separate transform object too

  // how are you going to deal with only selectively retreiving data
  
}

/* Drawable interface
 */
interface Drawable {
  draw(Entity);
  clear...;
}

/* Stylable mixin
 */
class Styled {
  styles...;
  prev_style;
  curr_style;
  draw...;
  clear...;
}

/* Hierarchical mixin
 */
class Hierarchical {
  parents...;
  children...;
  add_child;
  add_parent;
}

/* CallBacked mixin
 */
class CallBacked {
  callbacks...; // maps names to list of functions
  add_callback(name, fn); // add to callbacks
  // could also verify callback is allowed?
  // i.e. should init callbacks with possible callback names, can't add
  // new ones externally...
  execute_callbacks(name, params); // execute all associated callbacks...
}
 

class Entity implements Hierarchial, Styled, Transformable, Callbacked {
  // have ID defined here?

  constructor() {}
  draw(transform, scene) {}
  clear() {}
}

class Style implements Drawable, Callbacked {
  // stateless (maintain state in Entity) or stateful?
  // simpler for now if stateful...
  // but kinda seems like Style should just be a static thing
  // that knows how to draw desired thing...
  // like, don't even pass trasnform or anything to style
  // style literally just gets a set of points?
  // Wait, no, probably should pass it the transform. Pass it everything
  // the entity has.
  // Buuut, easier for now if just have Style objects?

  // Maybe scene could keep track of stuff used for rendering that would
  // otherwise go in a Style object?
  // So Entities are abstract
  // Styles are different ways of drawing entities
  // Scenes are collections of Entities...and info/data on how they should
  // be drawn?
  
}

class Scene {

  obj_map;
  CM: ContextManager;
  
  draw(user) {}
  clear(user) {} //?
  /*
    Have Scene object, which has a render(view_id) fn
    Scene object also keeps track of id->obj map and handles queries, etc.
    Views have draw(transform, scene, context??) and clear(...) fns
    Scene just calls draw(identity, ...) on passed view ? 

    Ok, maybe scene should have slightly more important role?
    Can basically be the 'glue' between Entities and Styles
    Like, keeps track of id->entity map
    And entity->style map
    Also entity->stuff for drawing map (that Styles can use)
    I guess this is sorta convenient because it makes 
    But, if drawing data isn't associated with specific style, could
    screw up when switching styles..

    Ok, what actual advantages does the heavyweight Scene usage have?
    - Entities don't have to keep track of anything Style-related
    - maybe not so bad - could have map from entity/id->{curr, prev, params}
      could call that like a StyleInfo object...
    - ...
    Bad
    - can no longer just make an entity and call entity.draw() or something
    - harder to do stuff within Styles (if styles are static) like creating
      specific events / doing callbacks...?
   */
}

class User {
  // keep track of view...
  // and dimensions of screen, etc.?
  constructor() {}
  
}

class ContextManager {

}
