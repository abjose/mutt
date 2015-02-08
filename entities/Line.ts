module Entity {

  export class Line implements Base.Entity {
    type: string;
    style: string;
    start: Entity.Point;
    end: Entity.Point;
    
    constructor(args) {
      this.start = args.start;
      this.end = args.end;
      this.type = 'line';
      this.style = args.style;
    }
  }
  
}
