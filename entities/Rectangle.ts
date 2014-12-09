
/// <reference path="Entity.ts" />

module Entity {
  export class Rectangle extends Entity {

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
	'canvas': new Style.CanvasRect(),
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

module Style {
  export class CanvasRect implements EntityStyle {
    name = 'canvas';

    render(rect: Entity.Rectangle, scene: Scene) {
      scene.ctx.fillStyle="black";
      scene.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      //rect.prev_style = 'canvas';
    }

    clear(rect: Entity.Rectangle, scene: Scene) {
      scene.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
  }
}
