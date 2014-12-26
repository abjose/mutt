/// <reference path="Style.ts" />
/// <reference path="Scene.ts" />
/// <reference path="../entities/Rectangle.ts" />
/// <reference path="../entities/Point.ts" />

module Base {
  // figure out how to put these in-line
  interface StyleMap { [name: string]: Style; }
  interface EntityMap { [name: string]: Entity; }

  // sure this shouldn't be an interface?
  export class Entity {
    //z_index: number;
    //components: EntityMap;

    // consider adding ...contains(pt), inside(rect)
    // move(x, y) or something (and also getters...or change that)
    // getTransformed(...view, render)
    // for everything - nice if checks if Style can handle thing before
    // handling on own (like creating events, etc.)

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

    overlaps(rect: Entities.Rectangle) {
      throw new Error('This method is abstract');
    }

    contains(pt: Entities.Point) {
      throw new Error('This method is abstract');
    }

    move(pt: Entities.Point) {
      throw new Error('This method is abstract');
    }

  }
}
