/* TODO
- allow more sensible event handling (like if style can handle events itself)
- add lines, then add a rect made out of lines
- make little divs that can be dragged to resize
  and little lines around border for changing dims
  and still click to drag
- make an example XML 'document'
- work on stage/view stuff...
- make things into modules and put them in different files
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
- figure out how to automate TS workflow - including compilation, testing
- Entities "what's needed to describe this object, nothing else"
  Styles   "what's needed to actually render in this style, given entity"
- give entities ability to deal with input stuff
  (like ondragstart, ondrop, ondragover, onclick...)
- if not going to use transforms, get rid of gl-matrix stuff
  (like don't need to use vecs in Points)
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

  distance(pt: Point) {
    return Math.sqrt(this.norm(pt));
  }

  norm(pt: Point) {
    return Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2);
  }
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

  // consider adding ...contains(pt), inside(rect)
  // move(x, y) or something

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
    theta: number; //...
    
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
   		pt.y >= this.pt.y && pt.y <= this.pt.y + this.height);
    }

  move(pt: Point) {
    this.x = pt.x;
    this.y = pt.y;
  }

  overlaps(rect: Rectangle) {
    // find centers
    var c1 = new Point(this.pt.x + this.width / 2, this.pt.y + this.height / 2);
    var c2 = new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
    // find differences
    var xdiff = Math.abs(c1.x - c2.x);
    var ydiff = Math.abs(c1.y - c2.y);
    return (xdiff < (this.width / 2 + rect.width / 2) &&
	    ydiff < (this.height / 2 + rect.height / 2))
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

class Line extends Entity {

    constructor(public start: Point, public end: Point) {
	super();

	this.styles = {
	    'canvas': new CanvasLine(),
	};
	this.curr_style = 'canvas';
	this.prev_style = 'canvas';
    }

  // uhhh
  get x() { return this.start.x; }
  get y() { return this.start.y; }

  move(pt: Point) {
    var dx = this.end.x - this.start.x;
    var dy = this.end.y - this.start.y;
    this.start.x = pt.x;
    this.start.y = pt.y;
    this.end.x = pt.x + dx;
    this.end.y = pt.y + dy;
  }

  overlaps(rect: Rectangle) {
    var width = this.end.x - this.start.x;
    var height = this.end.y - this.start.y;
    var line_rect = new Rectangle(this.start, width, height);
    return rect.overlaps(line_rect) || line_rect.overlaps(rect);
  }

  contains(pt: Point) {
    var near_pt = this.nearestPoint(pt);
    var dist = near_pt.distance(pt);
    return dist < 5;
  }

  nearestPoint(pt: Point) {
    // http://paulbourke.net/geometry/pointlineplane/
    // return the point on the line segment nearest to 'pt'
    // oh god please clean this up
    var x1 = this.start.x;
    var y1 = this.start.y;
    var x2 = this.end.x;
    var y2 = this.end.y;
    var x3 = pt.x;
    var y3 = pt.y;
    var u = ((x3-x1)*(x2-x1) + (y3-y1)*(y2-y1)) / (this.start.norm(this.end))
    var x = x1 + u*(x2 - x1);
    var y = y1 + u*(y2 - y1);
    var xMin = Math.min(x1, x2);
    var xMax = Math.max(x1, x2);
    var yMin = Math.min(y1, y2);
    var yMax = Math.max(y1, y2);
    x = Math.max(Math.min(x, xMax), xMin);
    y = Math.max(Math.min(y, yMax), yMin);
    return new Point(x, y);
  }
}

class CanvasLine implements EntityStyle {
    name = 'canvas';

    render(line: Line, scene: Scene) {
	scene.ctx.fillStyle="#00000";
	scene.ctx.beginPath();
	scene.ctx.moveTo(line.start.x, line.start.y);
	scene.ctx.lineTo(line.end.x, line.end.y);
	scene.ctx.stroke();
	//line.prev_style = 'canvas';
    }

    clear(line: Line, scene: Scene) {
        // awk, clears the entire rect
        var width = line.end.x - line.start.x;
	var height = line.end.y - line.start.y;
	scene.ctx.clearRect(line.start.x, line.start.y, width, height);
    }

}

class Scene {
    // maybe scene should contain ContextManager, etc. (i.e. 'practical'
    // rendering things) 
    // in which case only need to pass entity and scene to a style to render

    entities: Entity[];
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

  getEntities(rect: Rectangle) {
    // returns all entities in the passed rectangle
    var overlaps = [];
    for (var i=0; i < this.entities.length; i++) {
      if (this.entities[i].overlaps(rect)) {
	overlaps.push(this.entities[i]);
      }
    }
    return overlaps;
  }
  
    handle_mousedown(pt: Point) {
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
	  this.dragged.move(new Point(this.key.mouse_x - this.off_x,
				      this.key.mouse_y - this.off_y));
	    this.render();
	}
    } 
}


// just make a type of rectangle that takes two rectangles as input
// (view and display)
// (should later switch to transforms?)
// and then will... just display everything as expected?
// or could have like a TransparentView which displays things as they want
// to be
// and a CanvasView which tries to display things a canvas elements....
// so basically Scene should just keep track of things, later can have scene
// have quadtree or something...
// and...also OK to have Scene contain Scenes?!?!?!??!?!??!?!?!?!
// in which case scenes need to have location/bounds/etc...
// maybe scene should be pure list of entities
// and views are basically selectors for entities
// so add something on top that lets select what kind of entities to see
// so I guess intuitively a view is a "scene" and a scene is a...stage?
class View extends Entity {

  view_rect: Rectangle;
  render_rect: Rectangle;
  // only show entities tagged with ....
  // should make this an object
  //tags: string[];
  
  constructor(view_rect, render_rect, tags) {
    this.view_rect = view_rect;
    this.render_rect = render_rect;
    this.tags = {};
  }
}

class TransparentView implements EntityStyle {
  name = 'transparent';

  render(view: View, scene: Scene) {
    // query scene, render things...
    var entites = scene.getEntities(this.view_rect);
  }

  clear(view: View, scene: Scene) {
    // query scene, clear things...
  }
}


// make this a class
//class InputHandler {
var Key = {
    pressed: {},
    mouse_down: false,
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
	this.mouse_down = true;
      scene.handle_mousedown(new Point(this.mouse_x, this.mouse_y));
      console.log(line1.contains(new Point(this.mouse_x, this.mouse_y)));
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
}
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
window.addEventListener('mousedown', function(event) { Key.onMousedown(event); }, false);
window.addEventListener('mouseup', function(event) { Key.onMouseup(event); }, false);
window.addEventListener('mousemove', function(event) { Key.onMouseMove(event); }, false);

//var scene = new Scene(500, 500);
var scene = new Scene(500, 500, Key);
var rect1 = new Rectangle(new Point(50, 50), 100, 100);
var rect2 = new Rectangle(new Point(150, 150), 50, 75);
var line1 = new Line(new Point(50, 160), new Point(300, 100));
var line2 = new Line(new Point(70, 60), new Point(300, 150));
var line3 = new Line(rect1.pt, rect2.pt);

var l1 = new Line(new Point(0, 0), new Point(10, 0));
var p1 = new Point(-15, 5);
console.log(l1.nearestPoint(p1));

scene.add(rect1);
//scene.add(rect2);
scene.add(line1);
scene.add(line2);
//scene.add(line3);
scene.render();



var testrect = new Rectangle(new Point(0, 0), 100, 100);
//setInterval(console.log(scene.getEntities(testrect)), 100);
//setInterval(function() { console.log(scene.getEntities(rect1)) }, 100);

//rect.x = 4;
//rect.y = 2;
//rect.x += 1; // does this work?
