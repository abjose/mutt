/// <reference path="entities/Point.ts" />


module Base {
  // figure out how to put these in-line
  interface StyleMap { [name: string]: Style; }
  interface EntityMap { [name: string]: Entity; }

  // sure this shouldn't be an interface?
  export class Entity {
    //z_index: number;
    //components: EntityMap;

    // consider adding ...contains(pt), inside(rect)
    // move(x, y) or something (and also getters...or change that)
    // getTransformed(...view, render)
    // for everything - nice if checks if Style can handle thing before
    // handling on own (like creating events, etc.)

    // ok, I guess can try out having style stuff in here...
    styles: StyleMap;
    prev_style: string;
    curr_style: string;

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

  export interface Style {
    name: string;
    render(entity: Entity, scene: Scene): void;
    clear(entity: Entity, scene: Scene): void;
  }


  export class User {
    //IH: InputHandler;
    // should keep track of view stack, screen area...

    constructor() {
      //this.IH = new InputHandler();
    }
  }

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
