// Experiment with a mixin-heavy version of mutt

/*
Isn't it going to be a pain to save objects using mixins? Like
the actual class doesn't really know all the things that compose it...
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
  preds...;
  succs...;
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
  // should be able to pass object?
}


class Entity implements Hierarchial, Styled, Transformable, Callbacked {
  // have ID defined here?
}

class Style implements Drawable, Callbacked {
  // stateless (maintain state in Entity) or stateful?
}
