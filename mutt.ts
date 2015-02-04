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


*/


class MultiIndex {
  // very simple for now
  // TODO: improve IDs
  // TODO: add more indices (particularly for assisting view)
  // TODO: switch query to taking a query object like before

  constructor() {
    this.index = {};
  }
  
  put(entity) {
    v['id'] = Math.random();
    this.index[v.id] = v; // lol
  }
  
  get(id) {
    return this.index[k];
  }
  
  remove(entity) {
    delete this.index[entity.id];
  }

  query() {
    return this.entities.index; // TODO: lol
  }
}

var mutt {
  entities: new MultiIndex();

  update() {
    var entities_to_draw = this.entities.query();
    for (var id in entities_to_draw) {
      if (entities_to_draw.hasOwnProperty(id)) {
	this.draw(entity);
      }
    }
  }
  
  draw(entity) {
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
  }

  add(entity) {
    this.entities.add(entity);
  }

  remove() {
    this.entities.remove(entity);
  }
}


// something like
var r1 = new Rectangle({blah});
var r2 = new Rectangle({blah});
mutt.add(r1);
mutt.add(r2);
mutt.update();
mutt.remove(r2);
mutt.update();
