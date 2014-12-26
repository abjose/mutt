
module Base {
  /* TODO
     - add 'origin'? And do translations before/after other things.
     - maybe nice to have both a set_pos(...) and move(...) fns
  */
  
  export class Transform {
    protected T: Float32Array;
    
    constructor() {
      this.T = mat2d.create();
    }
    copy() {
      var T = new Transform();
      mat2d.copy(T.T, this.T);
      return T;
    }

    rotate(rad: number) {
      mat2d.rotate(this.T, this.T, rad);
    }
    scale(sx: number, sy: number) {
      mat2d.scale(this.T, this.T, new Float32Array([sx, sy]));
    }
    translate(tx: number, ty: number) {
      mat2d.translate(this.T, this.T, new Float32Array([tx, ty]));
    }

    invert() {
      var T = new Transform();
      mat2d.invert(T.T, this.T);
      return T;
    }
    multiply(other: Transform) {
      // return this * other
      var T = new Transform();
      mat2d.multiply(T.T, this.T, other.T);
      return T;
    }
    mul(other: Transform) {
      return this.multiply(other);
    }
    transform(pt: Entities.Point) {
      // return transformed copy of pt
      var temp_pt = vec2.fromValues(pt.x, pt.y);
      vec2.transformMat2d(temp_pt, temp_pt, this.T);
      return new Entities.Point(temp_pt[0], temp_pt[1]);
    }
  }
}
