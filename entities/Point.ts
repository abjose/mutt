
module Entity {
  export class Point implements Base.Entity {
    type: string;
    style: string;
    id: string;
    
    constructor(public x, public y) {
      this.type = 'point';
      this.style = '';
      this.id = Utility.UUID();
    }

    distance(pt: Entity.Point) {
      return Math.sqrt(this.norm(pt));
    }

    norm(pt: Entity.Point) {
      return Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2);
    }
    
  }
}
