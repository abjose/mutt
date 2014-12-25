/// <reference path="../Base.ts" />

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
module Entities {
  export class View extends Base.Entity {

    // only show entities tagged with ....
    // should make this an object
    //tags: string[];
    tags;
    
    constructor(public view_rect: Rectangle, public render_rect: Rectangle) {
      super();
      
      this.styles = {
	'transparent': new Styles.TransparentView(),
      };
      this.curr_style = 'transparent';
      this.prev_style = 'transparent';
      
      this.tags = {};
    }

    overlaps(rect: Rectangle) {
      return false;
    }

    contains(pt: Point) {
      return this.render_rect.contains(pt);
    }

    move(pt: Point) {
      this.render_rect.move(pt);
    }

    get x() { return this.render_rect.x }
    get y() { return this.render_rect.y }
  }
}

module Styles {
  export class TransparentView implements Base.Style {
    name = 'transparent';

    render(view: Entities.View, scene: Base.Scene) {
      var transformed; 
      // set up clipping region
      // SHOULDN'T HAVE CANVAS SPECIFIC CODE HERE!!
      scene.ctx.save();
      scene.ctx.rect(view.render_rect.x, view.render_rect.y,
		     view.render_rect.width, view.render_rect.height);
      scene.ctx.stroke();
      scene.ctx.clip();
      
      // query scene and render transformed versions of entities
      var entities = scene.getEntities(view.view_rect);
      for (var i = 0; i < entities.length; i++) {
	transformed = entities[i].getTransformed(view.view_rect,
						 view.render_rect);
	transformed.render(scene);
      }

      // return context to normal
      scene.ctx.restore();
    }

    clear(view: Entities.View, scene: Base.Scene) {
      // just clear clipping region...
      // make less hacky
      scene.ctx.clearRect(view.render_rect.x-1, view.render_rect.y-1,
			  view.render_rect.width+2, view.render_rect.height+2);
    }
  }

}
