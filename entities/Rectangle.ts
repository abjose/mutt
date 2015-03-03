module Entity {
  export class Rectangle implements Base.Entity {
    type: string;
    style: string;
    x: number; y: number;
    width: number; height: number;
    id: string;

    constructor(args) {
      this.x = args.x; this.y = args.y
      this.width = args.width; this.height = args.height;
      this.type = 'rect';
      this.style = args.style;
      this.id = Utility.UUID();
    }

    to_geo() {
      return new Geometry.Polygon(
	[new Vertex(this.x, this.y),
	 new Vertex(this.x + this.width, this.y),
	 new Vertex(this.x + this.width, this.y + this.height),
	 new Vertex(this.x, this.y + height)]);
    }
  }
}
