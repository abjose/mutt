
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

  interface Transform2D {
    // OK, maybe change transform so can't 'chain internally' - like can
    // keep track of translation, scale, rotation internally, but
    // to chain transforms have to tell them to transform each other.
    origin: Point;
    rotate(rad: number);
    translate(dx: number, dy: number);
    scale(sx: number, sy: number);
  }
  
  interface AbstractEntity {
    // Represent entities abstractly.
    render_style: string;
    transform: Transform;
    relation: GeometricRelations;
    messenger: Messenger;
  }

  interface GeometricRelations {
    contains(pt: Point): boolean;
    intersects(rect: Rectangle): boolean;
    distance(pt: Point): number;
  }

  interface Messenger {
    // note - there can be multiple callbacks per topic, but only one per route
    private callbacks: [topic: string][route: string]: fn;
    // associate a new callback with a topic and route
    on(topic: string, route: string, fn);
    // execute all callbacks associated with the given topic
    emit(topic: string, args);
    // remove all callbacks with the given route
    off(route: string);
  }

  interface AbstractRenderer<EntityType> {
    // note static-ness
    static draw(entity: EntityType, base_transform: Transform);
    static clear(entity: EntityType, base_transform: Transform);
    // Renderer can override some functionality of Entity
    relation?: GeometricRelations;
    messenger?: Messenger;
  }
  
  interface Scene {
    /* TODO:
       - just have a 'render' thing that clears everything (for now) and
         redraws it all
    */
    context_manager: ContextManager;
    user: User;
    index: MultiIndex;  // for now will probably just have spatial index

    render(); // ask user for view and render it
  }

  interface MultiIndex {
    // Allow generic interface to various indexes...
    // Given future usage of some kind of database, is MultiIndex best approach?
    indices: EntityIndex[];
    add(k, v);
    update(k, v); // ??
    remove(k);
    find(k); // ??
    query(k)
  }
  
  interface EntityIndex {
    can_handle_key(key): boolean;
  }
  
  interface User {
    // Is user a special view? I.e. should create a new view inside view
    // the user is technically inside of to represent user? Otherwise how to
    // have multiple users in the same view...
    // But then how to update views?
    view_stack;
    get_current_view();
  }

  interface ContextManager {
    // Easier if this gets passed the entire set of things to
    // render all at once?
  }
}
