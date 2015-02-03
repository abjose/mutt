
// where to put this?
// stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function UUID() {
  var d = performance.now();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
}

class Point implements Entity {
  x: number; y: number;
  constructor(args) {
    this.x = args.x;
    this.y = args.y;
  }
}

interface Transform {
  // OK, maybe change transform so can't 'chain internally' - like can
  // keep track of translation, scale, rotation internally, but
  // to chain transforms have to tell them to transform each other.
  // So basically can rotate, scale, etc. an entity and won't be 'ordered'
  // - will always rotate, scale, translate?
  origin: Point;
  rotate(rad: number);
  translate(dx: number, dy: number);
  scale(sx: number, sy: number);
}

interface GeometricRelations<EntityType> {
  contains(pt: Point): boolean;
  // add AABB class?
  intersects(rect: Rectangle): boolean;
  distance(pt: Point): number;
}

class Messenger {
  //private callbacks: [topic: string][route: string]: fn;
  private callbacks;

  constructor() {
    this.callbacks = {}
  }
  
  // associate a new callback with a topic and route
  on(topic: string, route: string, fn) {
    if (this.callbacks[topic] == undefined) this.callbacks[topic] = {};
    this.callbacks[topic][route] = fn;
  }
  
  // execute all callbacks associated with the given topic
  emit(topic: string, args) {
    this.callbacks[topic].forEach(function(fn) { fn(args); });
  }
  
  // remove all callbacks with the given route
  off(route: string) {
    this.callbacks.forEach(function(routes) { delete routes[route]; });
  }
}

interface Events {
  onmousedown;
  onmouseup;
  ondrag;
}

//interface AbstractEntity {}

// consider making Messenger and Transform mixins, because same for everything?
class Entity { // implements AbstractEntity {
  id: string;
  styles: RenderStyleManager;
  layers: string[]; // actually should be an object
  transform: Transform;
  z_index: number; // somehow to combine various pose-related thing?
  //temp_state: TempState; // worth having for sure? could just put on raw Entity
  // sure you want events as its own thing?
  events: EventHandlers; // keep track of event-related functions
  relation: GeometricRelations;
  messenger: Messenger;

  constructor(args) {
    this.id = UUID(); // where do you want this?
    //this.styles = undefined;new RectStyles(args);
    //this.relation = new RectGeometry(this);
    this.messenger = new Messenger();
    this.transform = new Transform();
    //this.events = new RectEvents();    
    this.layers = args.layers;
  }
}

class Rectangle extends Entity {
  // A rectangle.
  x: number; y: number;
  w: number; h: number;
  constructor(args) {
    super(args);
    this.styles = new RectStyles(args);
    this.relation = new RectGeometry(this);

    this.x = args.x; this.y = args.y;
    this.w = args.w; this.h = args.h;
  }
}

class View extends Entity {
  view_rect: Rectangle;   // Viewed rectangle
  view_layers; // layers to 'look at'
  render_rect: Rectangle; // Rendered rectangle
  spatial_index: SpatialIndex;
  
  constructor(args) {
    super(args);
    this.spatial_index = args.spatial_index;
    this.view_rect = args.view_rect;
    this.view_layers = args.view_layers;
    this.render_rect = args.render_rect;
  }

  get_entities_in_view() {
    return this.spatial_index.get(this.view_rect);
  }
}

class RectGeometry implements GeometricRelations<Rectangle> { // ?
  rect: Rectangle;
  
  constructor(rect: Rectangle) {
    // sure this is how you want to access entity?
    // could make a mixin instead... or pass both to every fn...
    this.rect = rect;
  }
  
  distance(pt: Point) {
    var center = new Point(this.rect.x + this.rect.w / 2,
			   this.rect.y + this.rect.h / 2);
    return center.distance(pt);
  }
  
  contains(pt: Point) {
    return (pt.x >= this.rect.x && pt.x <= this.rect.x + this.rect.w &&
   	    pt.y >= this.rect.y && pt.y <= this.rect.y + this.rect.h);
  }
  
  intersects(rect: Rectangle) {
    // find centers
    var c1 = new Point(this.rect.x + this.rect.w / 2,
		       this.rect.y + this.rect.h / 2);
    var c2 = new Point(rect.x + rect.w / 2, rect.y + rect.h / 2);
    // find differences
    var xdiff = Math.abs(c1.x - c2.x);
    var ydiff = Math.abs(c1.y - c2.y);
    return (xdiff < (this.rect.w / 2 + rect.w / 2) &&
	    ydiff < (this.rect.h / 2 + rect.h / 2));
  }
}

class RectStyles implements RenderStyleManager {
  constructor(args) {
    this.styles = {
      'div': new DivRect(),
      //DivRect.name: new DivRect(),
    };
    this.curr_style = args.style;
    this.prev_style = undefined;
  }
}

interface RenderStyle<EntityType> {
  // note static-ness (except not because making un-static for now)
  name: string;
  context_type: string;
  // this will do what you intend, right?
  draw(entity: EntityType, base_transform: Transform, scene: Scene);
  clear(entity: EntityType, base_transform: Transform, scene: Scene);
  // return whatever kind of context this renderer needs?
  // pretty sure this is possible - can do stuff like document.createElement
  // and then set attributes in contextmanager...
  //static get_new_context({data like z_index});
  get_new_context;
  // Renderer can override some functionality of Entity
  relation?: GeometricRelations;
  messenger?: Messenger;
}

class DivRect implements RenderStyle<Rectangle> {
  name = 'div'; // change to context_type or something?
  element: HTMLElement;
  
  constructor() {
    this.element = document.createElement('div');
  }
  
  static draw(rect: Rectangle, base_transform: Transform, scene: Scene) {
    this.element.style.left = String(rect.x) + 'px';
    this.element.style.top  = String(rect.y) + 'px';
    this.element.style.width  = String(rect.width) + 'px';
    this.element.style.height = String(rect.height) + 'px';
    this.element.style.display = 'block';
    // TODO: transform
    rect.prev_style = 'div';
  }
  
  static clear(rect: Rectangle, base_transform: Transform, scene: Scene) {
    // sure this is needed?
    this.element.style.display = 'none';
  }
}

//class DivRectEvents implements Events {}

class MUTT {
  entities: MultiIndex;
  renderer: Renderer;

  draw() {
    // GET VIEWPORT FROM RENDERER NOW
    // grab the view
    var view = this.entities.get({id: view_id});
    // grab list of entities that will be drawn
    var entities_to_draw = this.entities.get({view: view});
    // initialize context manager
    this.context_manager.initialize_contexts(entities_to_draw);
    // tell view to draw
    view.draw(new Transform(), this);

    // what to do about drawing to user screen size? just force current entity
    // to have proper render_width/height??
    // ideally never actually take real view and make main view - only
    // have 'fake' user view that copies parameters of other views.
  }
  clear() {
    // grab the view
    var view = this.entities.get({id: view_id});
    // grab list of entities in view
    var entities_to_draw = this.entities.get({view: view});
    // clear them all
    view.clear();
    // so...Renderers should store context they render to?
  }
}

interface EntityIndex { // should template on something?
  put(entity: Entity);
  get(key, subset?);
  remove(entity_id: string);
}

class MultiIndex extends EntityIndex {
  // Allow generic interface to various indexes
  filter_order = ['region'];  
  //cache: Cache;
  //indexes: [entity_type: string]: EntityIndex;
  indexes;

  constructor(entities) {
    this.indexes = {};
    this.add_index('id', new IDIndex(entities)); // id->entity
    this.add_index('region',
		   new SpatialIndex(entities, this.get_entity)); // uhh
    //this.add_index('layer', new LayerIndex(entities)); // layer->id
    //this.add_index('z_index', new ZIndex(entities)); // z_index->id ????
  }
  
  add_index(index_type: string, index: EntityIndex) {
    this.indexes[index_type] = index;
  }

  put(entity: Entity) {
    this.indexes.forEach(function(index) {
      index.put(entity);
    });
  }
  
  get(filters) {
    // filters should be like {region: (Rectangle), 'layer': 2, ...}
    // execute filters from more to less efficient...not really making use of
    var filtered_ids = []; // just do stupidly for now
    for (var filter in filters) {
      if (filters.hasOwnProperty(filter)) {
	filtered_ids = filtered_ids.concat(
	  this.indexes[filter].get(filters[filter])
	);
      }
    }
    return filtered_ids;
  }

  remove(entity) {
    this.indexes.forEach(function(index) {
      index.remove(entity);
    });
  }

  get_entity(id: string) {
    return this.indexes['id'].get(id);
  }
}

class IDIndex implements EntityIndex {
  constructor(entities) {
    this.entities = {};
    entities.forEach(this.put);
  }

  put(entity: Entity) {
    this.entities[entity.id] = entity;
  }
  
  get(id: string) {
    return this.entities[id];
  }

  remove(entity: Entity) {
    delete this.entities[entity.id];
  }
}

class SpatialIndex implements EntityIndex {
  constructor(entities, entity_lookup_fn) {
    // uhh, is this IDs or actual objects? probably ids...
    // ok, think should pass entities _or_ ids, always return IDs unless..?
    this.entity_ids = [];
    this.lookup_id = entity_lookup_fn;
    entities.forEach(this.put);
  }

  put(entity: Entity) {
    this.entity_ids.push(entity.id);
  }
  
  get(rect: Rectangle) {
    var filtered_ids = []
    for (var i = 0; i < this.entity_ids.length; i++) {
      if (rect.intersects(this.lookup_id(this.entity_ids[i]))) {
	filtered_ids.push(this.entity_ids[i]);
      }
    }
    return filtered_ids;
  }
  
  remove(entity: Entity) {
    var index = this.entity_ids.indexOf(entity.id);
    if (index > -1) this.entities.splice(index, 1);
  }
}

class RenderStyleManager {
  styles; // [style_name]-> RenderStyle
  curr_style: string;
  prev_style: string;
  //RenderData...; // just an object from render_style to data for that style
  // Don't need renderdata if going to have RenderStyle on every Entity
  //set_style(style_name: string);
}

class Renderer {
  viewport: View; // ??
  //private contexts: ...; // map from id to context STILL NEED THIS?
  contexts;

  constructor(args) {
    this.viewport = new View({
      layers: [], //?
      view_layers: ['1'],
      view_rect: new Rectangle({x: 20, y: 30, w: 100, h: 100}),
      render_rect: new Rectangle({x: 0, y: 0, w: 500, h: 500}),
      spatial_index: args.spatial_index,
    });
  }
  
  initialize_contexts(entities: AbstractEntity[]) {
    // give set of things to draw, figures out what to give each of them
    var curr_context, curr_entity;
    var sorted_entities = sort_by_z_index(entities);

    this.contexts = {}; // reset contexts
    // iterate through z_index-ordered entities, generating context map
    for (var i = 0; i < sorted_entities.length; i++) {
      if (!correct_context_type(curr_context, curr_entity)) {
	curr_context = curr_entity.get_new_context();
      }
      this.contexts[curr_entity.id] = curr_context;
    }
  }
  
  get_context(view_id: string) {
    return this.contexts[view_id];
  }

  draw(entity_ids, entities) {

  }
}


/*
basic flow
- add some entities to mutt.entities
- call mutt.draw()
  (renderer view is set to some default)
- renderer calls entities.get({'region': ViewPort.viewrect}) or whatevs
- sort resulting ID list by increasing z-index (or make index for this)
- for each id, grab entity, grab context / make new one, and draw
  (get rid of context initialization stuff for now - just check if can reuse
   current context and call get_new_context otherwise)
  WAIT, what about hierarchical drawing.. if have to transform shit, don't want
  to tell it to draw from here...
  Well, I guess for some things could have a flag or override GeoRelation s.t.
  not picked up by region query... yeah, just do that
  Actually, maybe not much of a problem - if those entities are never added
  to mutt proper (but only their 'owners' are added) then internal things
  wouldn't show up in qurries
  This means that, for example, a toolbox would need to have a 'click' fn
  that could delegate clicks to internal buttons...

GOALS FOR TONIGH
- deal with compiler issues
- build up to rendering, testing each step...
- if get something rendering, start process of moving shit into better directory structure? maybe commit first
*/











var mutt = new MUTT();

var r1 = new Rectangle({x: 0, y: 0, w: 10, h: 10,
			style: 'div'});
var r2 = new Rectangle({x: 10, y: 10, w: 20, h: 20,
			style: 'div'});

mutt.entities.add(r1);
mutt.entities.add(r2);

var query = new Rectangle({x: 0, y: 0, w: 100, h: 100});
console.log(mutt.entities.get({region: query}));
