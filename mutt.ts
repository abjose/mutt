/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="paw.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/MultiIndex.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/StyleManager.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="base/TransformStack.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="styles/Rectangle/DivRect.ts" />
/// <reference path="styles/Line/CanvasLine.ts" />

/*
TODO:
- have entities be much more flexible - can have draw, transform, ...
  but not necessary
- add MultiIndex and friends

Minimal woof is...not doing that right now.  
But ultimately just messenger? Easy enough to have on entities and
styles...but want to have woof be its own object or a mixin or
component? Also want to allow events or what?

Minimal steps to prototype bootstrapping interface-creator:
- create woof so very easy to introspect/modify event settings
- at least need to add some kind of 'edit' command..and selection?
  and later these can be modified through mutt itself
- need to have some way of replicating structure of entities made in-mutt

Don't worry about bootstrapping for now Get demo working - something
like a graph where you can select the style if each edge/node

mutt 2du:
- move shit to separate files
- add spatial relation stuff to Rect and Line?
- add simple spatial query to MultiIndex
- add clipping
- make view
- think about messenger stuff
*/

var mutt = {
  entities: new Base.MultiIndex(),

  update: function() {
    var entities_to_draw = this.entities.query();
    for (var id in entities_to_draw) {
      if (entities_to_draw.hasOwnProperty(id)) {
	this.draw(entities_to_draw[id]);
      }
    }
  },
  
  draw: function(entity) {
    // sure you want this? Could just force all entities to define 'draw'
    var is_transformed = entity.transform != undefined;
    var has_draw = entity.draw != undefined;
    if (is_transformed) {
      paw.transform.pushState();
      paw.transform.add(entity.transform);
    }
    if (has_draw) {
      entity.draw();
    } else {
      paw.draw(entity);
    }
    if (is_transformed) {
      paw.transform.popState();
    }
  },

  add: function(entity) {
    this.entities.put(entity);
  },

  remove: function(entity) {
    this.entities.remove(entity);
  },
}
