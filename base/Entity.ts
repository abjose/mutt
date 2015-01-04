
module Base {
  // figure out how to put these in-line
  //interface StyleMap { [name: string]: Style; }
  interface StyleMap { [name: string]: any; }
  export interface EntityMap { [name: string]: Entity; }
  export interface ChildrenMap { [name: string]: string; }

  // sure this shouldn't be an interface?
  export class Entity {

    /* TODO:
       - add transform, include when rendering
       - to demo transform, have everything in scene being offset by single
         transform and control that transform (including rotation?!) with 
	 keyboard or something?
     */

    //z_index: number;
    //components: EntityMap;
    transform: Transform;

    //children: ChildrenMap;

    // consider adding ...contains(pt), inside(rect)
    // move(x, y) or something (and also getters...or change that)
    // getTransformed(...view, render)
    // for everything - nice if checks if Style can handle thing before
    // handling on own (like creating events, etc.)

    // ok, I guess can try out having style stuff in here...
    styles: StyleMap;
    prev_style: string;
    curr_style: string;

    draw(scene: Scene, base_transform: Transform) {
      this.styles[this.curr_style].draw(this, scene, base_transform);
    }
    
    // TODO: delete render
    render(scene: Scene) {
      this.styles[this.curr_style].render(this, scene);
    }

    clear(scene: Scene) {
      this.styles[this.prev_style].clear(this, scene);
    }

    overlaps(rect: Entities.Rectangle) {
      throw new Error('This method is abstract');
    }

    contains(pt: Entities.Point) {
      throw new Error('This method is abstract');
    }

    move(pt: Entities.Point) {
      throw new Error('This method is abstract');
    }
  }

  class CallBacked {
    // Facilitates creating callbacks between Entitie.
  }

  // class CallBacked {
  //   callbacks; // maps names to list of functions
  //   add_callback(name, fn); // add to callbacks
  //   // could also verify callback is allowed?
  //   // i.e. should init callbacks with possible callback names, can't add
  //   // new ones externally...
  //   execute_callbacks(name, params); // execute all associated callbacks...
  // }

/*
  Okkkkk
  So, this is a bad design decision, I guess.
  Instead, should:
  - use composition for transforms
  - have scene keep track of scene graph (i.e. don't use 'hierarchical')
  - ...use a library for callbacks?

Basically just want events... and callbacks. Find a library!

Ok, real talk (maybe):
Stop trying to do everything. For now, have convenient constraints:
- entities are completely abstract descriptions of the object
  (....including how it should be rendered?)
- Scene should be able to take a set of Entity IDs to draw and figure
  out how to draw them
  Have ContextManager for this? Don't worry about performance.
  Styles should reimplement anything Entity has that they can do more
  efficiently.
  Could call style Drawer instead? Or Renderer? Or Printer?
  And maybe change name from Entity to Shape?
  Ehh, maybe not...try to stick with typical names.

Scene should have ContextManager, SceneGraph
WAIT BUT if SceneGraph is defined externally to Entity, then
won't it be difficult to specify hierarchical Entities?
Scene should have render(view_id) and render_group([ids])
render(view_id) will figure out what to draw and call render_group(...)

Maybe should go back to thinking about just how to draw a scene
described by a JSON file (and redraw it every time).  You'd have
Entities with no specific hierarchy specified, just some of them would
have other Entities (or lists, objects, etc. of entities) as
members...and presumably those entities could have "draw" called on
them too, and the parent entity would make sure to do that when it was
being drawn (or cleared). So scene graph is implicit.  
Probably not actually JSON:
ToolBox:
 - constructor: this.listen(button1, 'click', function() {..change color..};)
 - id?
 - draw: function...
 - clear: function...
 - buttons: [
     Button:
       - id?
       - color
       - draw: ...
       - clear: ...
       - onClick: ...
     Button: 
     Button:
     Button:
 ]

And could have like GenericToolBox([buttons]), or RightClickToolBox(), ...
Does not having things be ID based pose any problem? Like if actually have
Entities as members, can get circular references...

OK, single responsibility principle:
Scene - tracks everything needed to draw the scene...? (god object?)
SceneList - where entities are actually stored
Entity - describes how a shape/object is and behaves (two things?)
EntityDrawer - given an Entity and a Transform, 
Transform - represents transformations

Could set up erasure callbacks rather than having to store prev_style...

Consider having both Entity and Drawer(?) be abstract...
Sending events from drawn object to seems Entity awkward...
*/

  interface Transform2D {
    rotate(rad: number);
    translate(dx: number, dy: number);
    scale(sx: number, sy: number);
  }
  
  interface AbstractEntity {
    // representation
    transform: Transform;
    contains(pt: Point): boolean;
    contained_by(rect: Rectangle): boolean;
    overlaps(rect: Rectangle): boolean;
        
    // interaction
    // kinda seems like these should be done differently
    onMouseDown();
    onMouseUp();
    onDrag(dx: number, dy: number); // uhh
    onKeydown();
    onKeyup();
  }

  interface AbstractDrawer<EntityType> {
    draw(entity: EntityType, base_transform: Transform);
    clear(entity: EntityType, base_transform: Transform);
  }
  
}
