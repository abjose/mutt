/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="paw.ts" />

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
*/


class MultiIndex {
  // very simple for now
  // TODO: improve IDs
  // TODO: add more indices (particularly for assisting view)
  // TODO: switch query to taking a query object like before

  index: any;
  
  constructor() {
    this.index = {};
  }
  
  put(entity) {
    entity['id'] = Math.random();
    this.index[entity.id] = entity; // lol
  }
  
  get(id) {
    return this.index[id];
  }
  
  remove(entity) {
    delete this.index[entity.id];
  }

  query() {
    return this.index; // TODO: lol
  }
}

var mutt = {
  entities: new MultiIndex(),

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
    console.log(is_transformed);
    var has_draw = entity.draw != undefined;
    console.log(has_draw);
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


class Rectangle {
  // make constructor take an object?
  type: string;
  style: string;
  transform: Base.Transform;
  
  constructor(public x, public y, public width, public height, transform?) {
    this.type = 'rect';
    this.style = 'div';
    this.transform = transform;
  }
}

// something like
paw.styles.add_style(new DivRect());
var r1 = new Rectangle(0, 0, 50, 50, new Base.Transform());
r1.transform.scale(3, 0.5);
r1.transform.rotate(3.141 * 0.25);
r1.transform.translate(250, 250);
// waaaaait, was it not applying because you were modifying the transform
// separately from the one inside the entity?
var r2 = new Rectangle(70, 70, 25, 25);
mutt.add(r1);
mutt.add(r2);
mutt.update();
//mutt.remove(r2);
//mutt.update();
