
module Base {

  export class Scene {
    // maybe scene should contain ContextManager, etc. (i.e. 'practical'
    // rendering things) 
    // in which case only need to pass entity and scene to a style to render

    // TODO: remove 'entities' (replace with entity_map)
    entities: Entity[];
    entity_map: EntityMap;
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

    draw_entity(entity_id: string, transform: Transform) {
      // need to do anything aside from look up the entity and tell it to
      // draw itself?
      // TODO: perhaps ultimately want to put things into a drawing queue
      // and draw everything at once, so can maybe do layering and other stuff
      // more intelligently.
      transform = transform || new Transform();
      entity_map[entity_id].draw(this, transform);
    }


    // maybe have already thought about this, but why not have the transform
    // just
    // and just be able to generate proper transform when necessary?
    
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


// TODO: move elsewhere?
// generate a random 'guid'
// stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
UUID() {
  var d = performance.now();
  // var uuid = 
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  // return uuid;
}
