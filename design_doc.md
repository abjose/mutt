MUTT DESIGN DOC
===============

Can make IDs more unique by prepending date or username or whatever...

Sure you want to think of everything existing in the same
space? Kinda seems intuitive to have different view look at different
documents (or at least things that could be treated as independent
documents). And this might be better suited to databases...

Don't have to have live updating, maybe even better if don't. Could
just persist to server when user saves an entity. Then if two users
both edit same entity, could try to resolve, lock, or insert both
versions in their own space to be resolved manually?

Ideally can track dirty areas and only redraw those, but don't for
now. Should also probably have a remove function...and add should
take an entity with id? Or just entity?  Just id?  Also entities
should be able to call update on scene when they're updated through
events... 

How to ignore multiple repeated calls to update? Guess will have to
wait until have some kind of 'dirty' functionality.  Could keep
track of what's dirty with just a list of ids. So entities wouldn't
have to update the scene themselves, just mark themselves as
dirty. And then on redraw get 'dirty list' by looking up everything
touched by dirty entities and redrawing.  

What if used objects to instantiate Messengers? Like didn't subclass
messengers but sent objects denoting edges, functions to call, ...
Cool because could make new messengers easily, but not super
nice. Could just make a subclass that allows this, but don't force
everything to do it. Could even automatically init somehow, based on
stuff in EventManager.
Ehh, still not sure Messengers should be sub-classed. Seems convenient
to just construct them in Entity constructor...

Cool if can animate view in mutt, could basically make presentations...
What exactly would animation require? Like the idea still of having
"abstract" animations operating through the entity, but also allowing
control to be yielded to the Renderer...



Make new object, ViewPort (extends View?) that keeps track of screen stuff?