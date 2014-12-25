
/// <reference path="../base/Base.ts" />

module Entities {
  export class Rectangle extends Base.Entity {

    pt: Point;
    width: number;
    height: number;
    theta: number; //...
    
    constructor(pt: Point, width: number, height: number) {
      super();
      
      this.pt = pt;
      this.width = width;
      this.height = height;
      
      this.styles = {
	'canvas': new Styles.CanvasRect(),
      };
      this.curr_style = 'canvas';
      this.prev_style = 'canvas';
    }

    contains(pt: Point) {
      return (pt.x >= this.pt.x && pt.x <= this.pt.x + this.width &&
   	      pt.y >= this.pt.y && pt.y <= this.pt.y + this.height);
    }

    move(pt: Point) {
      this.x = pt.x;
      this.y = pt.y;
    }

    getTransformed(view_rect: Rectangle, render_rect: Rectangle) {
      // consider returning some other value if too small?
      var x_scale = render_rect.width / view_rect.width;
      var y_scale = render_rect.height / view_rect.height;
      var new_width = this.width * x_scale;
      var new_height = this.height * y_scale;
      var new_x = render_rect.x + ((this.x - view_rect.x) * x_scale);
      var new_y = render_rect.y + ((this.y - view_rect.y) * y_scale);

      return new Rectangle(new Point(new_x, new_y), new_width, new_height);
    }

    overlaps(rect: Rectangle) {
      // find centers
      var c1 = new Point(this.pt.x + this.width / 2, this.pt.y + this.height / 2);
      var c2 = new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
      // find differences
      var xdiff = Math.abs(c1.x - c2.x);
      var ydiff = Math.abs(c1.y - c2.y);
      return (xdiff < (this.width / 2 + rect.width / 2) &&
	      ydiff < (this.height / 2 + rect.height / 2))
    }

    get x() { return this.pt.x; }
    get y() { return this.pt.y; }

    set x(val: number) { this.pt.x = val; }
    set y(val: number) { this.pt.y = val; }
  }
  
}

module Styles {
  export class CanvasRect implements Base.Style {
    name = 'canvas';

    render(rect: Entities.Rectangle, scene: Base.Scene) {
      scene.ctx.fillStyle="black";
      scene.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      //rect.prev_style = 'canvas';
    }

    clear(rect: Entities.Rectangle, scene: Base.Scene) {
      scene.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
  }

  export class LineRect implements Base.Style {
    // just for fun
    // how to spec what style each subcomponent should be?
    // actually seems not right to have raw entities in here - they should be styles?
    name = 'canvas';
    top: Entities.Line;
    left: Entities.Line;
    bottom: Entities.Line;
    right: Entities.Line;
    // should really make a polygon thing

    render(rect: Entities.Rectangle, scene: Base.Scene) {
      scene.ctx.fillStyle="black";
      scene.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      //rect.prev_style = 'canvas';
    }

    clear(rect: Entities.Rectangle, scene: Base.Scene) {
      scene.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
  }

  export class DivRect implements Base.Style {
    name = 'div';
    element: HTMLElement;
    
    constructor() {
      this.element = document.getElementById('myDiv');
    }
    
    render(rect: Entities.Rectangle, scene: Base.Scene) {
      this.element.style.left = String(rect.x) + 'px';
      this.element.style.top  = String(rect.y) + 'px';
      this.element.style.width  = String(rect.width) + 'px';
      this.element.style.height = String(rect.height) + 'px';
      this.element.style.display = 'block';
      rect.prev_style = 'div';
    }
    
    clear(rect: Entities.Rectangle, scene: Base.Scene) {
      this.element.style.display = 'none';
    }
  }
}
