/* TODO
- allow more sensible event handling (like if style can handle events itself)
- try more classical design (TypeScript!)
  have Entity, EntityStyle (or Type?)
  have Rect extends Entity, CanvasRect extends EntityStyle
- add lines, then add a rect made out of lines
- make little divs that can be dragged to resize
  and little lines around border for changing dims
  and still click to drag
- make an example XML 'document'
- work on stage/view stuff...
  just make a type of rectangle that takes two rectangles as input
  (view and display)
  (should later switch to transforms?)
- should entity pass transformed points for rendering, or normal points and
  transform?
- make things into modules and put them in different files
- get typescript thing for gl-matrix
- figure out good way to make Point class...(can basically be array?)
- have a special context object that you can pass a type and layer to and
  it will return the proper context (or whatever, css setting, etc.) to use
  for rendering
- probably want
  ContextManager
  InputManager
  Renderer
  SceneManager
  Entity
  EntityStyle
- Entity should be a class handling transforms, etc.
  Then specific instances (Rectangle, etc.) will be like 'constraints' to 
  make sure styles render properly


- split things into different files?
- figure out how to automate TS workflow - including compilation, testing
- represent scene ENTIRELY ABSTRACTLY
  meaning you can just add, transform, and remove entities
  maybe in a Scene object (or scenemanager)
- make tests to ensure that manipulations are happening as expected
  before you do any rendering
- get everything to render with canvas...
  just iterate through scene and render things for now...
  don't worry about order or anything
  or interactivity

  Entities "what's needed to describe this object, nothing else"
  Styles   "what's needed to actually render in this style, given entity"

  OK
  maybe trying to use transformations is stupid
  maybe just store position, width, and height, rotation...
  and then modify those
  don't even worry about storing in (abstract)  entity
*/

// if can keep all matrix library-specific code contained in Point and 
// Transform, then that would be super


/// <reference path="gl-matrix.d.ts" />

class Point {
  vec: Float32Array;
    
  constructor(x: number, y: number) { this.vec = vec2.fromValues(x, y); }
  get x() { return this.vec[0]; }
  get y() { return this.vec[1]; }
  set x(val: number) { this.vec[0] = val; }
  set y(val: number) { this.vec[1] = val; }
}

// interface Component {
//     points: Point[];
//     transform: Transform;
// }

// interface EntityGroup {...}
// figure out how to put these in-line
interface StyleMap { [name: string]: EntityStyle; }
//interface ComponentMap { [name: string]: Component; }
interface ComponentMap { [name: string]: any; }

class Entity {
  //z_index: number;
  //components: ComponentMap;

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

  world_to_entity(pt: Point) {}
  entity_to_world(pt: Point) {}
}

interface EntityStyle {
  name: string;
  render(entity: Entity, scene: Scene): void;
  clear(entity: Entity, scene: Scene): void;
}

class Rectangle extends Entity {

  pt: Point;
  width: number;
  height: number;
  
  constructor(pt: Point, width: number, height: number) {
    super();
    
    this.pt = pt;
    this.width = width;
    this.height = height;
    
    this.styles = {
      'canvas': new CanvasRect(),
    };
    this.curr_style = 'canvas';
    this.prev_style = 'canvas';
  }

  contains(pt: Point) {
    return (pt.x >= this.pt.x && pt.x <= this.pt.x + this.width &&
   	    pt.y >= this.pt.y && pt.y <= this.pt.y + this.height)
   }

  get x() { return this.pt.x; }
  get y() { return this.pt.y; }

  set x(val: number) { this.pt.x = val; }
  set y(val: number) { this.pt.y = val; }
}

class CanvasRect implements EntityStyle {
  name = 'canvas';

  render(rect: Rectangle, scene: Scene) {
    scene.ctx.fillStyle="#00000";
    scene.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    //rect.prev_style = 'canvas';
  }

  clear(rect: Rectangle, scene: Scene) {
    scene.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
  }
}

class Scene {
  // maybe scene should contain ContextManager, etc. (i.e. 'practical' rendering
  // things)
  // in which case only need to pass entity and scene to a style to render

  entities: Entity[];
  dragged;
  ctx;
  //cm: ContextManager;

  constructor(public width: number, public height: number) {
    // construct canvas context here I guess
    var ele = document.getElementById('myCanvas');
    this.entities = [];
    this.ctx = ele.getContext('2d');
    dragged = undefined;
  }
  
  add(entity: Entity) {
    this.entities.push(entity);
  }

  render() {
    for (var i=0; i < this.entities.length; i++) {
      this.entities[i].render(this);
    }
  }

  handle_mousedown(pt: Point) {
    for (var i=0; i < this.entities.length; i++) {
      if (this.entities[i].contains(pt)) {
	this.dragged = this.entities[i];
	break;
      }
    }
  }
 
  handle_mouseup() {
    this.dragged = undefined;
  }

  handle_mousemove() {
    if (this.dragged !== undefined) {
      console.log('dragging!');
      //this.dragged
    }
  } 
  
}


// make this a class
//class InputHandler {
var Key = {
  pressed: {},
  mouse_down: false,
  mouse_down_x: 0,
  mouse_down_y: 0,
  mouse_x: 0,
  mouse_y: 0,

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isKeyDown: function(keyCode) {
    return this.pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
  },

  onMousedown: function(event) {
    this.mouse_down_x = event.clientX;
    this.mouse_x = event.clientX;
    this.mouse_down_Y = event.clientY;
    this.mouse_y = event.clientY;
    this.mouse_down = true;

    scene.handle_mousedown(new Point(this.mouse_x, this.mouse_y));
  },
  
  onMouseup: function(event) {
    this.mouse_down = false;
    scene.handle_mouseup();
  },

  onMouseMove: function(event) {
    this.mouse_x = event.clientX;
    this.mouse_y = event.clientY;
    scene.handle_mousemove();
  },
  
  /*
    for dragging...
    could...store initial and current drag positions?
    or just have to store currently-dragged entity somewhere
    but kinda don't like that
    but that's probably better....
    could give all entities stuff for dealing with dragging and dropping...
    have stuff like ondragstart, ondrop, ondragover
    probably need a variety of things (or at least make simple to add)
    onclick, etc...
    well, need to at least add something that will keep track of initial
    mousedown position for dragging
  */
}
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
window.addEventListener('mousedown', function(event) { Key.onMousedown(event); }, false);
window.addEventListener('mouseup', function(event) { Key.onMouseup(event); }, false);
window.addEventListener('mousemove', function(event) { Key.onMouseMove(event); }, false);

var scene = new Scene(500, 500);
var rect1 = new Rectangle(new Point(50, 50), 100, 100);
var rect2 = new Rectangle(new Point(150, 150), 50, 75);
console.log(rect1);

scene.add(rect1);
scene.add(rect2);
scene.render();

//rect.x = 4;
//rect.y = 2;
//rect.x += 1; // does this work?
