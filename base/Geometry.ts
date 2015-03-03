module Geometry {
  enum PrimitiveType {vertex, polyline, polygon}
  export interface Primitive {
    type: PrimitiveType;
    get_verts(): Vertex[];
  }
  
  export class Vertex implements Primitive{
    type: PrimitiveType;
    constructor(public x: number, public y: number) {
      this.type = PrimitiveType.vertex;
    }
    
    get_verts() {
      return [this];
    }

    transform(t: Base.Transform) {
      return t.transform(this);
    }
  }

  export class Polyline implements Primitive {
    type: PrimitiveType;
    private vertices: Vertex[];

    constructor(verts: Vertex[]) {
      this.type = PrimitiveType.polyline;
      this.vertices = verts || [];
    }
    
    get_verts() {
      return this.vertices;
    }

    transform(t: Base.Transform) {
      return new Polyline(t.transform_verts(this.vertices));
    }
  }

  export class Polygon implements Primitive {
    type: PrimitiveType;
    private vertices: Vertex[];

    constructor(verts: Vertex[]) {
      this.type = PrimitiveType.polygon;
      this.vertices = verts || [];
    }

    get_verts() {
      return this.vertices.concat(this.vertices[0]);
    }

    transform(t: Base.Transform) {
      return new Polygon(t.transform_verts(this.vertices));
    }
  }
  
  export function distance(a: Primitive, b: Primitive) {
    // nope, need to also consider distance to part of segment
    return min_dist(a.get_verts(), b.get_verts());
  }
  
  export function contains(a: Primitive, b: Primitive) {
    if (a.type == PrimitiveType.vertex || a.type == PrimitiveType.polyline)
      return false;
    var av = a.get_verts();
    var bv = b.get_verts();
    for (var i = 0; i < bv.length; i++)
      if (!point_within(bv[i], av))
	return false;
    return true; 
  }
  
  export function within(a: Primitive, b: Primitive) {
    return contains(b, a);
  }
  
  export function crosses(a: Primitive, b: Primitive) {
    if (a.type == PrimitiveType.vertex || b.type == PrimitiveType.vertex)
      return false;
    return !within(a, b) && intersects(a, b);
  }
  
  export function intersects(a: Primitive, b: Primitive) {
    var av = a.get_verts();
    var bv = b.get_verts();
    for (var i = 0; i < bv.length; i++) 
      if (point_within(bv[i], av))
	return true;
    for (var i = 0; i < av.length; i++) 
      if (point_within(av[i], bv))
	return true;
    if (segments_intersect(av, bv)) return true;
    return false;
  }
  
  export function disjoint(a: Primitive, b: Primitive) {
    return !intersects(a, b);
  }
  
  // Do lines a0-a1 and b0-b1 intersect?
  function segment_intersects(a0: Vertex, a1: Vertex, b0: Vertex, b1: Vertex) {
    if (ccw(a0, a1, b0) * ccw(a0, a1, b1) > 0) return false;
    if (ccw(b0, b1, a0) * ccw(b0, b1, a1) > 0) return false;
    return true;
  }

  function segments_intersect(a: Vertex[], b: Vertex[]) {
    // see if (linked) segments described by a intersect with any in b
    for (var i = 0; i < a.length-1; i++) {
      for (var j = 0; j < b.length-1; j++) {
	if (segment_intersects(a[i], a[i+1], b[j], b[j+1]))
	  return true;
      }
    }
  }

  function nearest_pt_on_segment(a: Vertex, b: Vertex, pt: Vertex) {
    // http://paulbourke.net/geometry/pointlineplane/
    // return the point on segment ab nearest to pt
    var u = (((pt.x-a.x)*(b.x-a.x) + (pt.y-a.y)*(b.y-a.y)) / dist_squared(a,b));
    var x = a.x + u*(b.x - a.x);
    var y = a.y + u*(b.y - a.y);
    var xMin = Math.min(a.x, b.x);
    var xMax = Math.max(a.x, b.x);
    var yMin = Math.min(a.y, b.y);
    var yMax = Math.max(a.y, b.y);
    return new Vertex(Math.max(Math.min(x, xMax), xMin),
		      Math.max(Math.min(y, yMax), yMin));
  }

  function distance_to_segment(a: Vertex, b: Vertex, pt: Vertex) {
    return dist(pt, nearest_pt_on_segment(a, b, pt));
  }

  function distance_between_segments(a: Vertex, b: Vertex,
				     c: Vertex, d: Vertex) {
    // Minimum distance between ab and cd.
    // lol, definitely a faster way, maybe on bourke's website.
    return Math.min(distance_to_segment(a, b, c),
		    distance_to_segment(a, b, d),
		    distance_to_segment(c, d, a),
		    distance_to_segment(c, d, b));
  }

  function point_within(pt: Vertex, pts: Vertex[]) {
    // length - 1 because assumes includes start point twice...
    return Math.abs(sum_ccw(pt, pts)) == pts.length-1;
  }

  function sum_ccw(pt: Vertex, points: Vertex[]) {
    // sum results of ccw for all pairs of internal points
    var sum = 0;
    for (var i = 0; i < points.length - 1; i++) {
      //console.log(ccw(points[i], pt, points[i+1]));
      sum += ccw(points[i], pt, points[i+1]);
    }
    //console.log(sum);
    return sum;
  }
  
  // from http://www.mathcs.duq.edu/simon/Fall05/cs300notes3.html
  function ccw(p0: Vertex, p1: Vertex, p2: Vertex) {
    var dx1 = (p1.x - p0.x), dy1 = (p1.y - p0.y);
    var dx2 = (p2.x - p0.x), dy2 = (p2.y - p0.y);
    if (dy1*dx2 < dy2*dx1) return 1;
    if (dy1*dx2 > dy2*dx1) return -1;
    if (dx1*dx2 < 0 || dy1*dy2 < 0) return -1;
    if ((Math.pow(dx1, 2) + Math.pow(dy1, 2)) >=
	(Math.pow(dx2, 2) + Math.pow(dy2, 2))) return 0;
    return 1;
  }

  function dist_squared(a: Vertex, b: Vertex) {
    return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  }
  
  function dist(a: Vertex, b: Vertex) {
    return Math.sqrt(dist_squared(a, b));
  }

  function min_dist(a: Vertex[], b: Vertex[]) {
    var distances = [];
    for (var i = 1; i < a.length; i++)
      for (var j = 1; j < b.length; j++)
	distances.push(distance_between_segments(a[i-1], a[i], b[j-1], b[j]));
    return Math.min.apply(null, distances);
  }
}



var poly1 = new Geometry.Polygon([new Geometry.Vertex(0, 0),
				  new Geometry.Vertex(0, 1),
				  new Geometry.Vertex(1, 1),
				  new Geometry.Vertex(1, 0)]);
var poly2 = new Geometry.Polygon([new Geometry.Vertex(.2, .2),
				  new Geometry.Vertex(.2, .8),
				  new Geometry.Vertex(.8, .8),
				  new Geometry.Vertex(.8, .2)]);

// lol they don't intersect when on top of each other :'(

console.log('intersect?: ', Geometry.intersects(poly1, poly2));
console.log('1 contains 2?: ', Geometry.contains(poly1, poly2));
console.log('1 within 2?: ', Geometry.within(poly1, poly2));
