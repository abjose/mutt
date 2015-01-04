
module Base {
  // figure out how to put these in-line
  //interface StyleMap { [name: string]: Style; }
  interface StyleMap { [name: string]: any; }
  interface EntityMap { [name: string]: Entity; }
  interface EntityID { string; }
  interface ChildrenMap { [string]: EntityID; }

  // sure this shouldn't be an interface?
  export class Entity {

    /* TODO:
       - add transform, include when rendering
       - to demo transform, have everything in scene being offset by single
         transform and control that transform (including rotation?!) with 
	 keyboard or something?
     */

    //z_index: number;
    //components: EntityMap;
    private T: Transform; // misleadingly named...

    children: ChildrenMap;

    // consider adding ...contains(pt), inside(rect)
    // move(x, y) or something (and also getters...or change that)
    // getTransformed(...view, render)
    // for everything - nice if checks if Style can handle thing before
    // handling on own (like creating events, etc.)

    // ok, I guess can try out having style stuff in here...
    styles: StyleMap;
    prev_style: string;
    curr_style: string;

    draw(scene: Scene, transform: Transform) {
      this.styles[this.curr_style].draw(this, scene, transform);
    }
    
    // TODO: delete render
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
