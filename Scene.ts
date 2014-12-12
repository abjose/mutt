
module Scene {

  export class Scene {
    // maybe scene should contain ContextManager, etc. (i.e. 'practical'
    // rendering things) 
    // in which case only need to pass entity and scene to a style to render

    entities: Entity.Entity[];
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
      var overlap = [];
      for (var i=0; i < this.entities.length; i++) {
	if (this.entities[i].overlaps(rect)) {
	  overlap.push(this.entities[i]);
	}
      }
      return overlap;
    }
    
    handle_mousedown(pt: Entity.Point) {
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

    handle_mousemove(pt: Entity.Point) {
      if (this.dragged !== undefined) {
	this.clear();
	//this.dragged.x = this.key.mouse_x - this.off_x;
	//this.dragged.y = this.key.mouse_y - this.off_y;
	//this.dragged.move(new Entity.Point(this.key.mouse_x - this.off_x,
	//				   this.key.mouse_y - this.off_y));
	this.dragged.move(new Entity.Point(pt.x - this.off_x,
					   pt.y - this.off_y));
	this.render();
      }
    } 
  }


  export class InputHandler {
  //var Key = {
    pressed = {};
    mouse_down = false;
    mouse_x = 0;
    mouse_y = 0;

    LEFT = 37;
    UP = 38;
    RIGHT = 39;
    DOWN = 40;

    constructor(public scene: Scene) {
      // DON'T REALLY LIKE PASSING IN A SCENE...
      var self = this;
      window.addEventListener('keyup',
			      function(event) { self.onKeyup(event); }, false);
      window.addEventListener('keydown',
			      function(event) { self.onKeydown(event); }, false);
      window.addEventListener('mousedown',
			      function(event) { self.onMousedown(event); }, false);
      window.addEventListener('mouseup',
			      function(event) { self.onMouseup(event); }, false);
      window.addEventListener('mousemove',
			      function(event) { self.onMouseMove(event); }, false);
    }
    
    isKeyDown(keyCode) {
      return this.pressed[keyCode];
    }
    
    onKeydown(event) {
      this.pressed[event.keyCode] = true;
    }
    
    onKeyup(event) {
      delete this.pressed[event.keyCode];
    }

    onMousedown(event) {
      this.mouse_down = true;
      this.scene.handle_mousedown(new Entity.Point(this.mouse_x, this.mouse_y));
    }
    
    onMouseup(event) {
      this.mouse_down = false;
      this.scene.handle_mouseup();
    }

    onMouseMove(event) {
      this.mouse_x = event.clientX;
      this.mouse_y = event.clientY;
      this.scene.handle_mousemove(new Entity.Point(this.mouse_x, this.mouse_y));
    }
  }


}
