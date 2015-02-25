
module Geometry {
  export class RelationManager {
    // Still don't like this, would prefer if could just say
    // entity.contains(other_entity) or whatever and all transform stuff
    // would be handled
    scene: Base.TransformHierarchy;
    constructor(scene: Base.TransformHierarchy) {
      this.scene = scene;
    }

    get_transform(entity: Base.Entity) {
      var t = new Transform();
      if (this.scene.get_node(entity) != undefined)
	t = this.scene.transform_to_root(entity)
      return t;
    }

    relation(relation, args) {
      // TODO: probably better to just transform one entity to the other
      var t1 = args.t1 || this.get_transform(args.e1);
      var t1 = args.t2 || this.get_transform(args.e2);
      var geo1 = args.e1.to_geo().transform(t1);
      var geo2 = args.e1.to_geo().transform(t2);
      return geo1[relation](geo2);
    }
    
    distance(args) {
      return relation('distance', args);
    }
    contains(args) {
      return relation('contains', args);
    }
    within(args) {
      return relation('within', args);
    }
    crosses(args) {
      return relation('crosses', args);
    }
    intersects(args) {
      return relation('intersects', args);
    }
    disjoint(args) {
      return relation('disjoint', args);
    }    
  }
  
  interface Primitive {
    type: string;
    get_points(): Vertex[];
    transform(transform: Base.Transform): Primitive;
    distance(other: Primitive): boolean;
    
    contains(other: Primitive): boolean;
    within(other: Primitive): boolean;
    crosses(other: Primitive): boolean;
    intersects(other: Primitive): boolean;
    disjoint(other: Primitive): boolean;
  }
  
  export class Vertex implements Primitive{
    type: string;
    constructor(public x, public y) { this.type = 'point'; }
    get_points() { return [this]; }

    transform(transform: Base.Transform) {
      return transform(this);
    }

    distance(other: Primitive) {
      return min_dist(this.get_points(), other.get_points());
    }

    contains(other: Primitive) {
      return false;
    }

    within(other: Primitive) {
      return point_within(this, other.get_points());
    }

    crosses(other: Primitive) {
      return false;
    }
    
    intersects(other: Primitive) {
      // could return true if very close?
      return this.within(other);
    }

    disjoint(other: Primitive) {
      return !this.intersects(other);
    }
  }

  export class Polyline implements Primitive {
    type: string;
    private points: Vertex[];

    constructor(points: Vertex[]) {
      this.type = 'line';
      this.points = points || [];
    }
    
    get_points() {
      return this.points;
    }

    transform(transform: Base.Transform) {
      var new_pts = transform.transform_points(this.points);
      return new Polyline(new_pts);
    }

    distance(other: Primitive) {
      return min_dist(this.get_points(), other.get_points());
    }

    contains(other: Primitive) {
      return false;
    }
    
    within(other: Primitive) {
      return other.contains(this);
    }
    
    crosses(other: Primitive) {
      // TODO: ideally remove type and type-checks
      if (other.type == 'point') return false;
      if (other.type == 'polygon') return other.crosses(this);
      // Otherwise check for segment intersections
      if (segments_intersect(this.get_points(), other.get_points()))
	return true;
      return false;
    }
    
    intersects(other: Primitive) {
      return this.crosses(other) || this.within(other);
    }
    
    disjoint(other: Primitive) {
      return !this.intersects(other);
    }
  }

  export class Polygon implements Primitive {
    type: string;
    private points: Vertex[];

    constructor(points: Vertex[]) {
      this.type = 'polygon';
      this.points = points || [];
    }

    get_points() {
      return this.points.concat(this.points[0]);
    }

    transform(transform: Base.Transform) {
      var new_pts = transform.transform_points(this.points);
      return new Polygon(new_pts);
    }
    
    distance(other: Primitive) {
      return min_dist(this.get_points(), other.get_points());
    }

    contains(other: Primitive) {
      var pts = this.get_points();
      var other_pts = other.get_points();
      for (var i = 0; i < other_pts.length; i++) {
	if (!point_within(other_pts[i], pts))
	  return false;
      }
      return true;
    }

    within(other: Primitive) {
      return other.contains(this);
    }
    
    crosses(other: Primitive) {
      var pts = this.get_points();
      var other_pts = other.get_points();
      var initial_relation = point_within(other_pts[0], pts);
      for (var i = 1; i < other_pts.length; i++) {
	if (point_within(other_pts[i], pts) != initial_relation)
	  return true;
      }
      return false;
    }

    intersects(other: Primitive) {
      var pts = this.get_points();
      var other_pts = other.get_points();
      for (var i = 0; i < other_pts.length; i++) {
	if (point_within(other_pts[i], pts))
	  return true;
      }
      if (segments_intersect(pts, other_pts)) return true;
      if (other.intersects(this)) return true;
      return false;
    }
    
    disjoint(other: Primitive) {
      return !this.intersects(other);
    }
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
    // TODO: replace this either with something that gets shortest distance
    // between any two line segments, or allow representative points and just
    // get distance between those.
    var distances = [];
    for (var i = 0; i < a.length; i++)
      for (var j = 0; j < b.length; j++)
	distances.push(dist_squared(a[i], b[j]));
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

console.log('intersect?: ', poly1.intersects(poly2));
console.log('1 contains 2?: ', poly1.contains(poly2));
console.log('1 within 2?: ', poly1.within(poly2));

  
