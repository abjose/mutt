
module Entity {
  export class Point implements Base.Entity {
    type: string;
    style: string;
    //x: number; y: number;
    constructor(public x, public y) {
      this.type = 'point';
      //this.style = args.style;
      this.style = '';
    }
  }
}
