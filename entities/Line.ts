module Entity {

  export class Line implements Base.Entity {
    type: string;
    style: string;
    start: Entity.Point;
    end: Entity.Point;
    id: string;
    
    constructor(args) {
      this.start = args.start;
      this.end = args.end;
      this.type = 'line';
      this.style = args.style;
      this.id = Utility.UUID();
    }
  }
}
