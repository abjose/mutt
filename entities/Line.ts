
/// <reference path="Entity.ts" />

module Entity {
  export class Line extends Entity {
    // consider storing stuff for parametric representation?

    constructor(public start: Point, public end: Point) {
      super();

      this.styles = {
	'canvas': new Style.CanvasLine(),
      };
      this.curr_style = 'canvas';
      this.prev_style = 'canvas';
    }

    // uhhh
    get x() { return this.start.x; }
    get y() { return this.start.y; }

    move(pt: Point) {
      var dx = this.end.x - this.start.x;
      var dy = this.end.y - this.start.y;
      this.start.x = pt.x;
      this.start.y = pt.y;
      this.end.x = pt.x + dx;
      this.end.y = pt.y + dy;
    }

    getTransformed(view_rect: Rectangle, render_rect: Rectangle) {
      var x_scale = render_rect.width / view_rect.width;
      var y_scale = render_rect.height / view_rect.height;
      var new_start_x = render_rect.x + ((this.start.x - view_rect.x) * x_scale);
      var new_start_y = render_rect.y + ((this.start.y - view_rect.y) * y_scale);
      var new_end_x = render_rect.x + ((this.end.x - view_rect.x) * x_scale);
      var new_end_y = render_rect.y + ((this.end.y - view_rect.y) * y_scale);

      return new Line(new Point(new_start_x, new_start_y),
		      new Point(new_end_x, new_end_y));
    }

    overlaps(rect: Rectangle) {
      // see if rect contains either endpoint
      if (rect.contains(this.start)) return true;
      if (rect.contains(this.end)) return true;

      var ul = new Point(rect.x, rect.y);
      var ur = new Point(rect.x + rect.width, rect.y);
      var bl = new Point(rect.x, rect.y + rect.height);
      var br = new Point(rect.x + rect.width, rect.y + rect.height);
      // see if anything intersects
      if (this.intersects(new Line(ul, ur))) return true;
      if (this.intersects(new Line(ur, br))) return true;
      if (this.intersects(new Line(br, bl))) return true;
      if (this.intersects(new Line(bl, ul))) return true;
    }

    contains(pt: Point) {
      var near_pt = this.nearestPoint(pt);
      var dist = near_pt.distance(pt);
      return dist < 3;
    }

    nearestPoint(pt: Point) {
      // http://paulbourke.net/geometry/pointlineplane/
      // return the point on the line segment nearest to 'pt'
      // oh god please clean this up
      var x1 = this.start.x;
      var y1 = this.start.y;
      var x2 = this.end.x;
      var y2 = this.end.y;
      var x3 = pt.x;
      var y3 = pt.y;
      var u = ((x3-x1)*(x2-x1) + (y3-y1)*(y2-y1)) / (this.start.norm(this.end))
      var x = x1 + u*(x2 - x1);
      var y = y1 + u*(y2 - y1);
      var xMin = Math.min(x1, x2);
      var xMax = Math.max(x1, x2);
      var yMin = Math.min(y1, y2);
      var yMax = Math.max(y1, y2);
      x = Math.max(Math.min(x, xMax), xMin);
      y = Math.max(Math.min(y, yMax), yMin);
      return new Point(x, y);
    }

    intersects(line: Line) {
      // return true if this and passed line segment intersect
      //questions/9043805/test-if-two-lines-intersect-javascript-function
      var CCW = function(p1: Point, p2: Point, p3: Point) {
	return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
      }
      return ((CCW(this.start, line.start, line.end) !=
	       CCW(this.end, line.start, line.end)) &&
	      (CCW(this.start, this.end, line.start) !=
	       CCW(this.start, this.end, line.end)));	    
    }
  }
}


module Style {
  export class CanvasLine implements EntityStyle {
    name = 'canvas';

    render(line: Entity.Line, scene: Scene.Scene) {
      scene.ctx.strokeStyle="black";
      scene.ctx.lineWidth = 1;
      scene.ctx.beginPath();
      scene.ctx.moveTo(line.start.x, line.start.y);
      scene.ctx.lineTo(line.end.x, line.end.y);
      scene.ctx.stroke();
      //line.prev_style = 'canvas';
    }

    clear(line: Entity.Line, scene: Scene.Scene) {
      // awk, what if not white? always able to access BG color?
      scene.ctx.strokeStyle = "white";
      scene.ctx.fillStyle = "white";
      scene.ctx.lineWidth = 5;
      scene.ctx.beginPath();
      scene.ctx.moveTo(line.start.x, line.start.y);
      scene.ctx.lineTo(line.end.x, line.end.y);
      scene.ctx.stroke();
      // also draw circles at begining and end just in case
      scene.ctx.arc(line.start.x, line.start.y, 5, 0, 2*Math.PI, false);
      scene.ctx.arc(line.end.x, line.end.y, 5, 0, 2*Math.PI, false);
      scene.ctx.fill();
    }
  }
}
