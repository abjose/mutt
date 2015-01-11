
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


  /* new design */
  
  
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
    id: string;
    render_style: string;
    transform: Transform;
    z_index: number; // put this in transform?
    relation: GeometricRelations;
    messenger: Messenger;
  }

  interface GeometricRelations {
    contains_pt(pt: Point): boolean;
    intersects_rect(rect: Rectangle): boolean; // add AABB class?
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
    entities: MultiIndex;
    render(view: View); // not id?
  }

  interface EntityIndex {
    add(entity_id: string);
    update(entity_id: string);
    remove(entity_id);
    query(...);  // should template based on this?
  }

  interface MultiIndex extends EntityIndex {
    // Allow generic interface to various indexes
    cache: Cache;
    indexes: EntityIndex[]; // better to store map from type to index?
    // Can always have many-to-one mapping if index can
    // handle multiple types of queries...
    add_index(index: EntityIndex);
  }

  interface Cache {
    // should extend EntityIndex?
    // for now, basically don't do anything...
    // will be used for fetching an entity if necessary
    // and deleting LRU entities if necessary
    // also need to deal with the server overwriting the cache...
    // I guess can just be like
    // Scene.entities.cache.invalidate(entity_id);
    // and so will refetch...or could pass along actual JSON too...
    // have UUID code in here I guess.

    // is the cache what you can use to associate entity_ids to entities?
  }

  interface ContextManager {
    // assume get everything to render all at once?
    // Then naive approach is basically to:
    // - sort by z-index
    // - ignore things that are too small?
    // - somehow find what kind of thing the entity needs to render on
    // - look at front of 'context list' or whatever
    // -- if right type of context, render on to it
    // -- otherwise, append new context and render
    // what about for divs and such, where they need to be above an
    // html element like a canvas? Just get canvas' z-index I guess?

    // Alternately, equally effective to just 'stream' entities as they come?
    // Would have to keep track of what contexts had what z-indices in them...
    // and then might have to split or re-render parts of context list
    // so ideally would have some way to hash in to based on z-index
    // and would just give you the top if highest, and deal with splitting and
    // merging automatically...
  }
}

/* Simple way of preventing users from getting data they shouldn't
have - cache requests stuff from server, and sends over an ID
including something only the 'real' user would know. Then server
compares that to locally stored thing...  Wait, maybe it doesn't make
sense for the cache to do the requesting - should have a 'fetcher' or
something that makes use of the cache.  Also to make IDs more unique,
could add username and/or time of creation Maybe should have
Communication class that deals with sockets and stuff, cache can use
that (or any entity that needs to modify itself...wait shouldn't all
changes go to server?). Should still have cache if also have comm
class?
*/
