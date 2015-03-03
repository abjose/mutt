
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

    to_geo() {
      return new Geometry.Vertex(this.x, this.y);
    }
    
  }
}
