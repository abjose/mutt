module Entity {
  export class Rectangle implements Base.Entity {
    type: string;
    style: string;
    x: number; y: number;
    width: number; height: number;
    transform: Base.Transform;

    constructor(args) {
      this.x = args.x; this.y = args.y
      this.width = args.width; this.height = args.height;
      this.type = 'rect';
      this.style = args.style;
      this.transform = undefined || args.transform;
    }
  }
}
