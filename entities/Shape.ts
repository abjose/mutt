module Entity {
  export class Polygon implements Base.Entity {
    id: string;
    type: string;
    style: string;
    points: Entity.Point[];

    constructor(args) {
      this.points = args.points;
      this.type = 'shape';
      this.style = args.style;
      this.id = Utility.UUID();
    }

    to_geo() {
      var verts = [];
      for (var i = 0; i < points.length; i++)
	verts.push(new Vertex(points[i].x, points[i].y));
      return verts.
    }
  }
}
