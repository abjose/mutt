var selected = null,  // Object of the element to be moved
x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
x_off = 0, y_off = 0;

class Transform {
    // TODO: caching...
    // translate
    tx: number;
    ty: number;
    // rotate
    theta: number;
    // scale
    sx: number;
    sy: number;

    translate(x, y) {
	this.tx += dx;
	this.ty += dy;
    }

    rotate(theta) {
	this.theta = theta;
    }

    scale(x, y) {
	this.sx = x;
	this.sy = y;
    }

    getTransform() {
	return mat2d.create()
	    .translate(T, T, vec2.fromValues(this.tx, this.ty))
	    .rotate(T, T, this.theta)
	    .scale(T, T, vec2.fromValues(this.sx, this.sy));
    }

    transformPoints(pts) {
	var T = this.getTransform();
	new_pts = []
	
	for (var i = 0; i < pts.length; i++) {
	    new_pts.push(vec2.transformMat2d(vec2.create(), pts[i], T));
	}

	return new_pts;
    }
}

interface Component {
    points: Point[];
    transform: Transform;
}

// figure out how to put these in-line
interface StyleMap { [name: string]: EntityStyle; }
interface ComponentMap { [name: string]: Component; }

// should just be interfaces?
// maybe not, can define render abstractly? but will it have access to 
class Entity {
    // just keep these in here?
    contexts;
    scene;

    curr_style: string;
    prev_style: string;
    styles: StyleMap;
    components: ComponentMap;
    transform: Transform;

    constructor(components: Entity[], transform: Transform) {}

    render(scene, contexts) { 
	this.styles[curr_style].render(this, scene, contexts); //hmmmmm
    }
    clear(scene, contexts)  { 
	this.styles[prev_style].clear(this, scene, contexts);
    }

    add_style(style: EntityStyle) {}
    set_style(style: string) {}
}

interface EntityStyle {
    name: string;
    render(entity: Entity): void;
    clear(entity: Entity): void;
}

class Rectangle extends Entity {
    constructor(p1, p2, p3, p4) {
	// pass up description here...
	component = {'points': [p1, p2, p3, p4]};
	// pass up...
	// could add styles here?
    }
}

class CanvasRect extends EntityStyle {
    name: 'canvas';

    render() {
	var ele = document.getElementById(this.id);
	var ctx = ele.getContext('2d');
	ctx.fillStyle="#00000";
	ctx.fillRect(this.parent.x, this.parent.y,
		     this.parent.w, this.parent.h);
	this.parent.prev_style = 'canvas';
    }

    clear() {
	var ele = document.getElementById(this.id);
	var ctx = ele.getContext('2d');
	ctx.clearRect(this.parent.x, this.parent.y,
 	 	      this.parent.w, this.parent.h);
    }
}

class DivRect extends EntityStyle {
    name: 'div';

    render() {
	this.parent.clear();
	var ele = document.getElementById(this.id);
	ele.style.left   = String(this.parent.x) + 'px';
	ele.style.top    = String(this.parent.y) + 'px';
	ele.style.width  = String(this.parent.w) + 'px';
	ele.style.height = String(this.parent.h) + 'px';
	ele.style.display = 'block';
	this.parent.prev_style = 'div';
    }

    clear() {
	var ele = document.getElementById(this.id);
	ele.style.display = 'none';
    }
}


var rect = {
  style: {},

  x: 10,
  y: 10,
  w: 50,
  h: 50,

  curr_style: 'div',
  prev_style: 'div',
};

rect.add_style = function() {};
rect.update_style = function() {};
rect.contains = function(x, y) {
  return (x >= this.x && y >= this.y && 
	  x <= this.x + this.w && y <= this.y + this.h);
};
rect.render = function() {
  this.style[this.curr_style].render();
};
rect.clear = function() {
  this.style[this.prev_style].clear();
}

rect.style.div = {}

rect.style.div.id = 'myDiv';
rect.style.div.parent = rect; // gross

rect.style.div.render = function() {
  this.parent.clear();
  var ele = document.getElementById(this.id);
  ele.style.left   = String(this.parent.x) + 'px';
  ele.style.top    = String(this.parent.y) + 'px';
  ele.style.width  = String(this.parent.w) + 'px';
  ele.style.height = String(this.parent.h) + 'px';
  ele.style.display = 'block';
  this.parent.prev_style = 'div';
};

rect.style.div.clear = function() {
  var ele = document.getElementById(this.id);
  ele.style.display = 'none';
};


rect.style.canvas = {};
rect.style.canvas.id = 'myCanvas';
rect.style.canvas.parent = rect; // gross
rect.style.canvas.render = function() {
  var ele = document.getElementById(this.id);
  var ctx = ele.getContext('2d');
  ctx.fillStyle="#00000";
  ctx.fillRect(this.parent.x, this.parent.y,
	       this.parent.w, this.parent.h);
  this.parent.prev_style = 'canvas';
};

rect.style.canvas.clear = function() {
  var ele = document.getElementById(this.id);
  var ctx = ele.getContext('2d');
  ctx.clearRect(this.parent.x, this.parent.y,
 	 	this.parent.w, this.parent.h);
};


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Will be called when user starts dragging an element
function init_drag(e) {
  // Store the object of the element which needs to be moved
  x_pos = document.all ? window.event.clientX : e.pageX;
  y_pos = document.all ? window.event.clientY : e.pageY;
  if (rect.contains(x_pos, y_pos)) {
    selected = rect;
    x_off = x_pos - selected.x;
    y_off = y_pos - selected.y;
  }
}

// Will be called when user dragging an element
function move_elem(e) {
  x_pos = document.all ? window.event.clientX : e.pageX;
  y_pos = document.all ? window.event.clientY : e.pageY;
  if (selected !== null) {
    selected.clear();
    selected.x = x_pos - x_off;
    selected.y = y_pos - y_off;
    selected.render();
  }
}

// Destroy the object when we are done
function end_drag() {
  selected = null;
}


document.onmousedown = init_drag;
document.onmousemove = move_elem;
document.onmouseup = end_drag;
document.onkeypress = function(e) {
  var chCode = ('charCode' in e) ? e.charCode : e.keyCode;
  switch (chCode) {
  case 49:
    rect.clear();
    rect.curr_style = 'div';
    rect.render();
    break;
  case 50:
    // MAKE IT SO CAN CLEAR AND RENDER IN ONE CALL
    // LIKE PROBABLY HAVE A SET_POS OR SOMETHING
    // ALSO A SET_STYLE
    rect.clear();
    rect.curr_style = 'canvas';
    rect.render();
    break;
  }
}
rect.render();


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
*/


var p1 = vec2.fromValues(0, 0);
var p2 = vec2.fromValues(1, 0);
var p3 = vec2.fromValues(0, 1);
var m1 = mat2d.create();
mat2d.translate(m1, m1, vec2.fromValues(1,0));
console.log(m1);
mat2d.translate(m1, m1, [1, 0]);
console.log(m1);
mat2d.rotate(m1, m1, 3.141/2);
vec2.transformMat2d(p1, p1, m1);
vec2.transformMat2d(p2, p2, m1);
vec2.transformMat2d(p3, p3, m1);
console.log(p1);
console.log(p2);
console.log(p3);
