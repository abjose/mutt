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
- replace scene (as main rendering component) with view
- add User
  have some idea of 'view stack' or something
  or add some way of addressing Scenes or something (so can be like 'this user
  is looking at this view, which is at this point in hierarchy...)
- add InputHandler
- add Scene (Layer?)
- get input to work through views??
  (just implement some kind of view-to-global point translation - could also 
  use this for rendering? write view-to-global and global-to-view)
- deal with color / size / etc. in some sensible way - maybe pass parameter
  object? keep on entity
- nice to add to_string and from_string methods - 
  will also make copying simpler?
- maybe useful if have some kind of checksum-maker for a document
*/


/* Import entities and styles */
/// <reference path="entities/Entity.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="entities/View.ts" />
/* Import other stuff */
/// <reference path="User.ts" />
/// <reference path="Scene.ts" />

var user = new User.User();
var scene = new Scene.Scene(500, 500, Key);


var rect1 = new Entity.Rectangle(new Entity.Point(50, 50), 50, 50);
var rect2 = new Entity.Rectangle(new Entity.Point(150, 150), 50, 75);
var line1 = new Entity.Line(new Entity.Point(50,90), new Entity.Point(300,100));
var line2 = new Entity.Line(new Entity.Point(70,40), new Entity.Point(300,150));
var line3 = new Entity.Line(rect1.pt, rect2.pt);

var l1 = new Entity.Line(new Entity.Point(0, 0), new Entity.Point(10, 0));
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
