module Entity {

  export class Line implements Base.Entity {
    type: string;
    style: string;
    id: string;
    start: Entity.Point;
    end: Entity.Point;
    
    constructor(args) {
      this.start = args.start;
      this.end = args.end;
      this.type = 'line';
      this.style = args.style;
      this.id = Utility.UUID();
    }

    to_geo() {
      return new Geometry.Polyline(
      	[new Geometry.Vertex(this.start.x, this.start.y),
	 new Geometry.Vertex(this.end.x, this.end.y)]);
    }
  }
}
