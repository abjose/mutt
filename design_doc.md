MUTT DESIGN DOC
===============

Responsibilities:
- keep track of entities
- facilitate queries over entities?

Scene should have ContextManager, SceneGraph
WAIT BUT if SceneGraph is defined externally to Entity, then
won't it be difficult to specify hierarchical Entities?
Scene should have render(view_id) and render_group([ids])
render(view_id) will figure out what to draw and call render_group(...)

Maybe should go back to thinking about just how to draw a scene
described by a JSON file (and redraw it every time).  You'd have
Entities with no specific hierarchy specified, just some of them would
have other Entities (or lists, objects, etc. of entities) as
members...and presumably those entities could have "draw" called on
them too, and the parent entity would make sure to do that when it was
being drawn (or cleared). So scene graph is implicit.  
Probably not actually JSON:
ToolBox:
 - constructor: this.listen(button1, 'click', function() {..change color..};)
 - id?
 - draw: function...
 - clear: function...
 - buttons: [
     Button:
       - id?
       - color
       - draw: ...
       - clear: ...
       - onClick: ...
     Button: 
     Button:
     Button:
 ]

And could have like GenericToolBox([buttons]), or RightClickToolBox(), ...
Does not having things be ID based pose any problem? Like if actually have
Entities as members, can get circular references...

Could set up erasure callbacks rather than having to store prev_style...

Consider having both Entity and Drawer(?) be abstract...
Sending events from drawn object to seems Entity awkward...

