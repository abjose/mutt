/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="base/Geometry.ts" />
/// <reference path="paw.ts" />
/// <reference path="utility/uuid.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/MultiIndex.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="styles/Rectangle/DivRect.ts" />
/// <reference path="styles/Line/CanvasLine.ts" />

/*
TODO:
- make manipulating transform hierarchy less annoying
- reeeeeally need to improve canvas performance
  could group on render order, or even group everything that doesn't
  intersect another entity (if that's pretty fast)
- interesting to allow StyleManager to have default styles rather than
  forcing everything to be specified
- take advantage of transform stack when drawing in mutt
- should paw be 'folded in' to mutt?
- for making transforms more convenient, could take advantage of globalness of
  mutt - like rect.rotate(blah) could call mutt.scene.blah.blah

Minimal steps to prototype bootstrapping interface-creator:
- create woof so very easy to introspect/modify event settings
- at least need to add some kind of 'edit' command..and selection?
  and later these can be modified through mutt itself
- need to have some way of replicating structure of entities made in-mutt

Don't worry about bootstrapping for now. Get demo working - something
like a graph where you can select the style if each edge/node

Remember - don't worry about getting views to work in context of transform
hierarchy. Views are weird, and should just have a special draw function. Maybe.

Arguments for allowing multiple instances of a single entity in transform hier:
- simpler to have same entity in different places in multiple layers or whatever
- can like have lots of repeated entities, if that's a thing you want to do
Against:
- confusing...
- might lead to ambiguity when looking at entities
- makes events more complex
- makes storing temp objects locally more comples

Remember - liked idea of get_children that could be defined separately by 
different entities. But would need to call something more specific considering
number of interpretations of 'children'.

Consider letting entities register themselves in the transform hierarchy. Then
not stuck with 1:1 mapping between entities and transform nodes, and could do
stranger stuff...each entity could keep track of multiple things in the
scene graph (i.e. be a 'group'). And then don't need to add an artificial
way of adding non-entity nodes to the scen graph?

mutt 2du:
- add spatial relation stuff
- add simple spatial query to MultiIndex
- add clipping
- make view
- think about messenger stuff
*/

/*
mini-todo:
- get demo working again
*/

var mutt = {
  entities: new Base.MultiIndex(),
  scene: new Base.TransformHierarchy(),

  update: function() {
    var entities_to_draw = this.entities.query();
    for (var id in entities_to_draw) {
      if (entities_to_draw.hasOwnProperty(id)) {
	this.draw(entities_to_draw[id]);
      }
    }
  },
  
  draw: function(entity) {
    paw.transform.pushState();
    paw.transform.add(this.scene.transform_from_root(entity));
    
    // sure you want this? Could just force all entities to define 'draw'    
    if (entity.draw != undefined) {
      entity.draw();
    } else {
      paw.draw(entity);
    }
    
    paw.transform.popState();
  },

  add: function(entity) {
    this.entities.put(entity);  // change to add?
    this.scene.add_entity(entity);
  },

  remove: function(entity) {
    this.entities.remove(entity);
    this.scene.remove_entity(entity);
  },
}
