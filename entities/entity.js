/*
what should all entities have?

you should be able to pass them a 'view' transformation
which would be basically the box they're supposed to render themselves into
and a thing to render themselves in to

was going to say you need stuff for changing/setting position, but 
I think modifying transform is simpler way of doing that?

Ehh, basically want to pass in camera (i.e. view) transform
and entities need to apply their own transform as well
so views need to track their own transform as well as bounds (and surfaces)
*/


/*
Entity types:
- path (closed path => polygon)
- text
- image
- surface?
- view

I don't think surface should be an entity
there's really only one surface, right?
and surfaces are basically just 'names'.
*/