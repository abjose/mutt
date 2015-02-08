
module Base {
  /* TODO
     - add 'origin'? And do translations before/after other things.
     - maybe nice to have both a set_pos(...) and move(...) fns
     - convert so that contain the actual values for rotation, translation, etc.
       and only generate actual transform when necessary (like could have
       getter for .T or something?). This way can just look up individual
       values where that's more important (like when need to make CSS transform)
       But this won't quite work for combining transforms...
       Unless expect sort of non-standard behavior from transforms - like
       basically assume everything is additive...
       Or, could just allow parameters to be accessed for directly constructing
       CSS transforms.
       Alternately could add something to look at the matrix and output
       how much it would rotate, translate, etc.
  */
  
  export class Transform {
    //protected T: Float32Array;
    T: Float32Array;
    
    constructor() {
      this.T = mat2d.create();
    }
    copy() {
      var T = new Transform();
      mat2d.copy(T.T, this.T);
      return T;
    }
    matrixString() {
      // maybe just loop
      return String(this.T[0]) + ','+String(this.T[1])
	+ ','+String(this.T[2]) + ','+String(this.T[3])
	+ ','+String(this.T[4]) + ','+String(this.T[5]);
    }

    // Rather than directly transforming T, transform the identity matrix
    // and then set T = I*T, so that transforms happen in intuitive order.
    rotate(rad: number) {
      var I = mat2d.create();
      mat2d.rotate(I, I, rad);
      mat2d.mul(this.T, I, this.T);
    }
    scale(sx: number, sy: number) {
      var I = mat2d.create();
      mat2d.scale(I, I, new Float32Array([sx, sy]));
      mat2d.mul(this.T, I, this.T);
    }
    translate(tx: number, ty: number) {
      var I = mat2d.create();
      mat2d.translate(I, I, new Float32Array([tx, ty]));
      mat2d.mul(this.T, I, this.T);
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
    //transform(pt: Entities.Point) {
    transform(pt) { // change these back...
      // return transformed copy of pt
      var temp_pt = vec2.fromValues(pt.x, pt.y);
      vec2.transformMat2d(temp_pt, temp_pt, this.T);
      //return new Entities.Point(temp_pt[0], temp_pt[1]);
      return {x: temp_pt[0], y: temp_pt[1]};
    }
  }
}
