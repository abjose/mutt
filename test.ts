var selected = null,  // Object of the element to be moved
x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
x_off = 0, y_off = 0;

// if can keep all matrix library-specific code contained in Point and 
// Transform, then that would be super

class Point {
    vec: Array<number>;
    
    constructor(x: number, y: number) {
	this.vec = vec2.fromValues(x, y);
    }
    
    get x() { return this.vec[0]; }
    get y() { return this.vec[1]; }
    set x(val: number) { this.vec[0] = val; }
    set y(val: number) { this.vec[1] = val; }
}

class Transform {
    // translate
    tx: number;
    ty: number;
    // rotate
    theta: number;
    // scale
    sx: number;
    sy: number;

    translate(dx: number, dy: number) {
	this.tx += dx;
	this.ty += dy;
    }

    rotate(theta: number) {
	this.theta = theta;
    }

    scale(x: number, y: number) {
	this.sx = x;
	this.sy = y;
    }

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
	var T =  mat2d.create()
	mat2d.translate(T, T, vec2.fromValues(this.tx, this.ty))
	mat2d.rotate(T, T, this.theta)
	mat2d.scale(T, T, vec2.fromValues(this.sx, this.sy));
	return T;
    }

    transformPoints(pts: Point[]) {
	var T = this.getTransform();
	var new_pts = []
	
	for (var i = 0; i < pts.length; i++) {
	    var temp_vec = vec2.creat();
	    vec2.transformMat2d(temp_vec, pts[i], T);
	    new_pts.push(new Point(temp_vec[0], temp_vec[1]));
	}

	return new_pts;
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

interface Entity {
    z_index: number;
    transform: Transform;
    components: ComponentMap;
}
interface EntityStyle {
    name: string;
    // uhh, how to clear if need to get right context? just store
    //render(entity: Entity, SM: SceneManager, CM: ContextManager): void;
    render(entity: Entity): void;
    //clear(entity: Entity, SM: SceneManager, CM: ContextManager): void;
    clear(): void;
}

class Rectangle implements Entity {
    
    constructor(top_left: Point, bottom_right: Point) {
	this.components = {
	    'top_left': top_left,
	    'bottom_right': bottom_right
	};
    }

    // uhh, need to convert point to local coordinates...
    contains(p: Point) {
	return (p.x >= this.top_left.x && p.x <= this.bottom_right.x &&
		p.y >= this.top_left.y && p.y <= this.bottom_right.y)
    }
}


class CanvasRect implements EntityStyle {
    name = 'canvas';
    ctx;

    //constructor(public SM: SceneManager, public CM: ContextManager) {
    constructor(entity: Entity) {
	var ele = document.getElementById('myCanvas');
	this.ctx = ele.getContext('2d');
    }

    render(entity: Entity) {
	var points = this.entity.components['points'];
	this.ctx.fillStyle="#00000";
	this.ctx.fillRect(points[0], points[1], points[2], points[3]);
	this.entity.prev_style = 'canvas';
    }

    clear() {
	ctx.clearRect(points[0], points[1], points[2], points[3]);
    }
}

class DivRect implements EntityStyle {
    name = 'div';
    element: HTMLElement;

    constructor() {
	this.element = document.getElementById('myDiv');
    }

    render(entity: Entity) {
	var tl = entity.components['top_left'];
	var br = entity.components['bottom_right'];
	this.element.style.left   = String(tl.x) + 'px';
	this.element.style.right  = String(br.x) + 'px';
	this.element.style.top    = String(tl.y) + 'px';
	this.element.style.bottom = String(br.y) + 'px';
	this.element.style.display = 'block';
	this.entity.prev_style = 'div';
    }

    clear() {
	this.element.style.display = 'none';
    }
}


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

*/

/*
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
*/



// "distant future" example FPM code



/*
OK, SIMPLER EXAMPLE:
mutt.draw('rectangle', ...);


need a little toolbox thing
can click on different tools
have a few tools - comment, project, edge
also want to be able to have toolboxes for each tool...
like for edge, can choose what connector looks like
toolboxes should 'float' above scene (optionally)

need some functions like set_tool, make_toolbox, ...
so probably need to model the user...
As another (view) entity? lolz...



mutt.init();
initial_tools = {
    'line': mutt.click_define(mutt.line),
    'text': mutt.click_define(mutt.textbox),
    'proj': mutt.click_define(mutt.view),
};
mutt.add(mutt.toolbox(initial_tools));
user = mutt.user();


click toolbar, then can drag out area to make thing...
could pop up relevant toolbar
*/
