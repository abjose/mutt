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

class Transform {
  // translation
  tx: number;
  ty: number;
  // rotation - in radians
  theta: number;
  // scale
  sx: number;
  sy: number;

  constructor() {
    this.tx = 0; this.ty = 0;
    this.sx = 0; this.sy = 0;
    this.theta = 0;
  }
  
  translate(x: number, y: number) { this.tx = x; this.ty = y; }
  rotate(theta: number) { this.theta = theta; }
  scale(x: number, y: number) { this.sx = x; this.sy = y; }

  add(T: Transform) {
    // add on another transform...choose a different name...
    // maybe should return new transform?
    this.tx += T.tx;
    this.ty += T.ty;
    this.sx += T.sx;
    this.sy += T.sy;
    this.theta += T.theta;
    return this;
  }

  getTransform() {
    var T =  mat2d.create();
    // does this work as expected?
    mat2d.translate(T, T, vec2.fromValues(this.tx, this.ty));
    mat2d.rotate(T, T, this.theta);
    mat2d.scale(T, T, vec2.fromValues(this.sx, this.sy));
    return T;
  }

  transformPoints(pts: Point[]) {
    var T = this.getTransform();
    var new_pts = []
    
    for (var i = 0; i < pts.length; i++) {
      new_pts.push(this.transformPoint(pts[i]));
    }

    return new_pts;
  }

  transformPoint(pt: Point, transform?: Transform) {
    var T = transform || this.getTransform();
    //var T = this.getTransform();
    var temp_vec = vec2.fromValues(pt.x, pt.y);
    vec2.transformMat2d(temp_vec, temp_vec, T);
    return new Point(temp_vec[0], temp_vec[1]);
  }
}

/*
What if for now forced entities to be 'primitive' in the sense of
having a Point array rather than internal entities
Then get working...
Then either extend or could have like an EntityGroup which can
have a list of entities
STOP
STOP THINKING ABOUT THIS
GET WORKING AS PRIMITIVES
YOU BIG DUMMY

OK, so fine for rect to take in actual coordinates
but store as point list in Entity
For now, change Entities to only hold an object of Point[]s
Entities "what's needed to describe this object, nothing else"
Styles   "what's needed to actually render in this style, given entity"
even removing curr_style, etc. for now
*/
// interface Component {
//     points: Point[];
//     transform: Transform;
// }

// figure out how to put these in-line
interface StyleMap { [name: string]: EntityStyle; }
//interface ComponentMap { [name: string]: Component; }
interface ComponentMap { [name: string]: any; }

class Entity {
  z_index: number;
  transform: Transform;
  components: ComponentMap;

  // ok, I guess can try out having style stuff in here...
  styles: StyleMap;
  prev_style: string;
  curr_style: string;

  constructor(components: ComponentMap) {
    this.z_index = 0;
    this.transform = new Transform();
    this.components = components || {};
  }

  render(scene: Scene) {
    this.styles[this.curr_style].render(this, scene);
  }

  clear(scene: Scene) {
    this.styles[this.prev_style].clear(this, scene);
  }

  // ideally change these to not access 'private' properties
  // setters
  set x(val: number) { this.transform.tx = val; }
  set y(val: number) { this.transform.ty = val; }
  set theta(val: number) { this.transform.rotate(val); }
  set scale_x(val: number) { this.transform.sx = val; }
  set scale_y(val: number) { this.transform.sy = val; }
  // getters
  get x() { return this.transform.tx; }
  get y() { return this.transform.ty; }
  get theta() { return this.transform.theta; }
  get scale_x() { return this.transform.sx; }
  get scale_y() { return this.transform.sy; }

  world_to_entity(pt: Point) {
    
  }

  entity_to_world(pt: Point) {
    return this.transform.transformPoint(pt);
  }
}

interface EntityStyle {
  name: string;
  render(entity: Entity, scene: Scene): void;
  clear(entity: Entity, scene: Scene): void;
}



class Rectangle extends Entity {
  
  constructor(top_left: Point, bottom_right: Point) {
    super({'top-left': top_left, 'bottom-right': bottom_right});

    this.styles = {
      'canvas': new CanvasRect(),
    };
    this.curr_style = 'canvas';
    this.prev_style = 'canvas';
  }

  // uhh, need to convert point to local coordinates...
  contains(pt: Point) {
    var top_left = this.components['top-left'];
    var bottom_right = this.components['bottom-right'];
    return (pt.x >= top_left.x && pt.x <= bottom_right.x &&
   	    pt.y >= top_left.y && pt.y <= bottom_right.y)
   }

  // wait...don't you want to manipulate the transform?

  // get x() { return this.components['top-left'].x; }
  // get y() { return this.components['top-left'].y; }
  // get width() { return Math.abs(this.x - this.components['bottom-right'].x); }
  // get height() { return Math.abs(this.y - this.components['bottom-right'].y); }

  // set x(val: number) { this.components['top-left'].x = val; }
  // set y(val: number) { this.components['top-left'].y = val; }
  // set width(val: number) { this.components['bottom-right'].x = this.x + val; }
  // set width(val: number) { this.components['bottom-right'].y = this.y + val; }
}


class CanvasRect implements EntityStyle {
  name = 'canvas';

  render(entity: Entity, scene: Scene) {
    var tl = entity.components['top-left'];
    var br = entity.components['bottom-right'];
    tl = entity.entity_to_world(tl);
    br = entity.entity_to_world(br);
    scene.ctx.fillStyle="#00000";
    scene.ctx.fillRect(tl.x, tl.y, br.x-tl.x, br.y-tl.y);
    //entity.prev_style = 'canvas';
  }

  clear(entity: Entity, scene: Scene) {
    var tl = entity.components['top-left'];
    var br = entity.components['bottom-right'];
    tl = entity.entity_to_world(tl);
    br = entity.entity_to_world(br);
    scene.ctx.clearRect(tl.x, tl.y, br.x-tl.x, br.y-tl.y);
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
var rect1 = new Rectangle(new Point(50, 50), new Point(100, 100));
var rect2 = new Rectangle(new Point(150, 150), new Point(175, 200));

scene.add(rect1);
scene.add(rect2);
scene.render();

//rect.x = 4;
//rect.y = 2;
//rect.x += 1; // does this work?
