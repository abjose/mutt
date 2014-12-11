/* TODO
- allow more sensible event handling (like if style can handle events itself)
- add lines, then add a rect made out of lines
- make little divs that can be dragged to resize
  and little lines around border for changing dims
  and still click to drag
- make an example XML 'document'
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
- not sure desired behavior - dragging line, drags all entities too
  considering it was an accident
  at least make sure it's not working in a way that will screw things up later
  ehh, maybe makes sense to just use references like this? kinda convenient...
  like the little corner dragging divs...can just share location with the thing
  they're supposed to change the location of
- what to do about styles when getting transformed copies of things?
- consider using save and restore for canvas operations
- add something for handling mouse clicks to views??....
- make 'clippable' interface that things can implement?
- WRITE ENTITY TESTS!!
- deal with color / size / etc. in some sensible way - maybe pass parameter
  object? keep on entity
- nice to add to_string and from_string methods - will also make copying simpler?
- maybe useful if have some kind of checksum-maker for a document
*/


/* Import entities and styles */
/// <reference path="entities/Entity.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="entities/View.ts" />


class Scene {
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

// make this a class
// or, put this into the User class
// or...make an InputHandler class and then keep keep ref in User
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
    scene.handle_mousedown(new Entity.Point(this.mouse_x, this.mouse_y));
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
window.addEventListener('keyup',
			function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown',
			function(event) { Key.onKeydown(event); }, false);
window.addEventListener('mousedown',
			function(event) { Key.onMousedown(event); }, false);
window.addEventListener('mouseup',
			function(event) { Key.onMouseup(event); }, false);
window.addEventListener('mousemove',
			function(event) { Key.onMouseMove(event); }, false);

var scene = new Scene(500, 500, Key);
var rect1 = new Entity.Rectangle(new Entity.Point(50, 50), 50, 50);
var rect2 = new Entity.Rectangle(new Entity.Point(150, 150), 50, 75);
var line1 = new Entity.Line(new Entity.Point(50, 160),
			    new Entity.Point(300, 100));
var line2 = new Entity.Line(new Entity.Point(70, 60),
			    new Entity.Point(300, 150));
var line3 = new Entity.Line(rect1.pt, rect2.pt);

var l1 = new Entity.Line(new Entity.Point(0, 0),
			 new Entity.Point(10, 0));
var p1 = new Entity.Point(-15, 5);

var vr = new Entity.Rectangle(new Entity.Point(0, 0), 100, 100);
var rr = new Entity.Rectangle(new Entity.Point(50, 50), 25, 25);
var view = new Entity.View(vr, rr);


scene.add(rect1);
//scene.add(rect2);
scene.add(line1);
scene.add(line2);
//scene.add(line3);
scene.add(view);


scene.render();
