
module Scene {

  export class Scene {
    // maybe scene should contain ContextManager, etc. (i.e. 'practical'
    // rendering things) 
    // in which case only need to pass entity and scene to a style to render

    entities: Entity.Entity[];
    dragged;
    ctx;
    key;
    off_x;
    off_y;
    //cm: ContextManager;

    // remove key...
    constructor(public width: number, public height: number, key) {
      // construct canvas context here I guess
      var ele = document.getElementById('myCanvas');
      this.entities = [];
      this.ctx = ele.getContext('2d');
      dragged = undefined;
      this.key = key;
    }
    
    add(entity: Entity.Entity) {
      this.entities.push(entity);
    }

    // SHOULD GET RID OF RENDER AND CLEAR?!
    // don't think of this as an "active" thing that can be rendered,
    // but mostly for storage/administration
    render() {
      for (var i=0; i < this.entities.length; i++) {
	this.entities[i].render(this);
      }
    }

    clear() {
      for (var i=0; i < this.entities.length; i++) {
	this.entities[i].clear(this);
      }
    }

    getEntities(rect: Entity.Rectangle) {
      // returns all entities in the passed rectangle
      var overlaps = [];
      for (var i=0; i < this.entities.length; i++) {
	if (this.entities[i].overlaps(rect)) {
	  overlaps.push(this.entities[i]);
	}
      }
      return overlaps;
    }
    
    handle_mousedown(pt: Entity.Point) {
      for (var i=0; i < this.entities.length; i++) {
	if (this.entities[i].contains && this.entities[i].contains(pt)) {
	  this.dragged = this.entities[i];
	  this.off_x = this.key.mouse_x - this.dragged.x;
	  this.off_y = this.key.mouse_y - this.dragged.y;
	  break;
	}
      }
    }
    
    handle_mouseup() {
      this.dragged = undefined;
    }

    handle_mousemove() {
      if (this.dragged !== undefined) {
	this.clear();
	//this.dragged.x = this.key.mouse_x - this.off_x;
	//this.dragged.y = this.key.mouse_y - this.off_y;
	this.dragged.move(new Entity.Point(this.key.mouse_x - this.off_x,
					   this.key.mouse_y - this.off_y));
	this.render();
      }
    } 
  }
}
