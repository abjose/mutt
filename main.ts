/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/Scene.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="base/User.ts" />
/// <reference path="input/Input.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="entities/View.ts" />

/* TODO
- allow more sensible event handling (like if style can handle events itself)
- add lines, then add a rect made out of lines
- make little divs that can be dragged to resize
  and little lines around border for changing dims
  and still click to drag
  perhaps for this makes sense to have nicer way of building things out of 
  components - so like if define a polygon as a series of points, easy to 
  drag them around...
  or if make rectangle two corners or something...
  or corners + edges...and keep track of all of them?
  or easy if edges are built on corners, and know how dragging edges
  should translate corners and vice-versa...
- make an example XML 'document'
- have a special context object that you can pass a type and layer to and
  it will return the proper context (or whatever, css setting, etc.) to use
  for rendering
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
- make 'clippable' interface that things can implement?
- WRITE ENTITY TESTS!!
- replace scene (as main rendering component) with view
- add User
  have some idea of 'view stack' or something
  or add some way of addressing Scenes or something (so can be like 'this user
  is looking at this view, which is at this point in hierarchy...)
- get input to work through views??
  (just implement some kind of view-to-global point translation - could also 
  use this for rendering? write view-to-global and global-to-view)
- deal with color / size / etc. in some sensible way - maybe pass parameter
  object? keep on entity
- nice to add to_string and from_string methods - 
  will also make copying simpler?
- maybe useful if have some kind of checksum-maker for a document
- perhaps have Scene keep track of style-related stuff entity now keeps track
  of - like current and previous style for each entity, etc.
- Make toXML and fromXML (or whatever) another requirement for entities 
  Then once you've replaced scene rendering with view, you'll be so close! 
  Can start hooking up with a server. 
  Maybe for transparent view can have a different internal view for each 
  tech used? Ideally not, but not sure how to deal with clipping otherwise...

- DON'T THROW THE BABY OUT WITH THE BATHWATER
- add IDs? (pass to entity when constructed?)
- add more scene stuff... (for handling IDs, etc.)
- add more user stuff
- add hierarchicalness
- add callbacks (as mixin?)
- make input handling less dumb

- Sure this will be well-suited to working with sockets / server-side
  stuff?  How to make robust to user screwing with things too much?
  Honestly doesn't matter if screwing with things...as long as can't
  screw with other people's things when they shouldn't be able to.

- Worth reconsidering inheritance hierarchy? Maybe nice if shapes
  were completely separate from rendering, like they don't even have
  draw functions? Then scene deals with looking up how to draw them,
  and passing the shape to the proper Style.

- possibilities for changing scene:
  scene has draw(view_id) fn and keeps track of id->obj mapping
  scene just calls draw(identity, this) on passed view (from user)
  wait, then why not have Scene take caring of telling every entity to draw
  itself? Like if scene has draw(id, transform) thing than can 
  have views or whatever just call scene.draw(id, transform) on all
  their own objects
  but what advantage would this have over directly calling draw of target
  object (after looking up in id->obj mapping in scene?)

*/


// class CallBacked {
//   callbacks; // maps names to list of functions
//   add_callback(name, fn); // add to callbacks
//   // could also verify callback is allowed?
//   // i.e. should init callbacks with possible callback names, can't add
//   // new ones externally...
//   execute_callbacks(name, params); // execute all associated callbacks...
// }

var user = new Base.User();
var scene = new Base.Scene(500, 500);
var IH = new Input.InputHandler(scene);

var rect1 = new Entities.Rectangle(new Entities.Point(50, 50), 50, 50);
var rect2 = new Entities.Rectangle(new Entities.Point(150, 150), 50, 75);
var line1 = new Entities.Line(new Entities.Point(50,90),
			      new Entities.Point(300,100));
var line2 = new Entities.Line(new Entities.Point(70,40),
			      new Entities.Point(300,150));
var line3 = new Entities.Line(rect1.pt, rect2.pt);

var vr = new Entities.Rectangle(new Entities.Point(0, 0), 100, 100);
var rr = new Entities.Rectangle(new Entities.Point(50, 50), 25, 25);
var view = new Entities.View(vr, rr);

scene.add(rect1);
//scene.add(rect2);
scene.add(line1);
scene.add(line2);
//scene.add(line3);
scene.add(view);


scene.render();
