/// <reference path="Entity.ts" />
/// <reference path="Style.ts" />
/// <reference path="../entities/Rectangle.ts" />
/// <reference path="../entities/Point.ts" />

module Base {

  export class Scene {
    // maybe scene should contain ContextManager, etc. (i.e. 'practical'
    // rendering things) 
    // in which case only need to pass entity and scene to a style to render

    entities: Entity[];
    dragged;
    ctx;
    //key;
    //IH: InputHandler;
    off_x;
    off_y;
    //cm: ContextManager;

    // remove key...
    constructor(public width: number, public height: number) {
      // construct canvas context here I guess
      this.ctx = document.getElementById('myCanvas').getContext('2d');
      this.entities = [];
      this.dragged = undefined;
      //this.IH = new InputHandler();
      //this.key = undefined;
    }
    
    add(entity: Entity) {
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

    getEntities(rect: Entities.Rectangle) {
      // returns all entities in the passed rectangle
      var overlap = [];
      for (var i=0; i < this.entities.length; i++) {
	if (this.entities[i].overlaps(rect)) {
	  overlap.push(this.entities[i]);
	}
      }
      return overlap;
    }
    
    handle_mousedown(pt: Entities.Point) {
      for (var i=0; i < this.entities.length; i++) {
	if (this.entities[i].contains && this.entities[i].contains(pt)) {
	  this.dragged = this.entities[i];
	  //this.off_x = this.key.mouse_x - this.dragged.x;
	  this.off_x = pt.x - this.dragged.x;
	  this.off_y = pt.y - this.dragged.y;
	  break;
	}
      }
    }
    
    handle_mouseup() {
      this.dragged = undefined;
    }

    handle_mousemove(pt: Entities.Point) {
      if (this.dragged !== undefined) {
	this.clear();
	//this.dragged.x = this.key.mouse_x - this.off_x;
	//this.dragged.y = this.key.mouse_y - this.off_y;
	//this.dragged.move(new Entities.Point(this.key.mouse_x - this.off_x,
	//				   this.key.mouse_y - this.off_y));
	this.dragged.move(new Entities.Point(pt.x - this.off_x,
					   pt.y - this.off_y));
	this.render();
      }
    } 
  }
}
