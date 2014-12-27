
module Tests {

  function pointsNearlyEqual(p1: Entities.Point, p2: Entities.Point) {
    // test passed points are approximately equal
    return p1.distance(p2) < 0.001;
  }
  
  export class CreationTests extends tsUnit.TestClass {
    
    verifyOriginalPointsArentModifiedDuringTransform() {
      var t = new Base.Transform();
      t.translate(2, 2);
      t.rotate(3.14);
      t.scale(1.5, 1.5);

      var p1 = new Entities.Point(0, 1);
      var p2 = new Entities.Point(-1, 1);
      t.transform(p1);
      t.transform(p2);

      // expected points
      var ex_p1 = new Entities.Point(0, 1);
      var ex_p2 = new Entities.Point(-1, 1);

      this.isTrue(pointsNearlyEqual(ex_p1, p1));
      this.isTrue(pointsNearlyEqual(ex_p2, p2));
    }
    
    transformPoint() {
      var t = new Base.Transform();
      t.translate(2, 2);
      t.rotate(3.14);
      t.scale(1.5, 1.5);

      var p1 = t.transform(new Entities.Point(0, 1));
      var p2 = t.transform(new Entities.Point(-1, 1));
      console.log(p1, p2);
      
      // expected points
      var ex_p1 = new Entities.Point(-3, -4.5);
      var ex_p2 = new Entities.Point(-1.5, -4.5);
      // things seem to apply backwards...

      this.isTrue(pointsNearlyEqual(ex_p1, p1));
      this.isTrue(pointsNearlyEqual(ex_p2, p2));
    }

    testInversionUndoesTransform() {
      var t = new Base.Transform();
      t.translate(2, 2);
      t.rotate(3.14);
      t.scale(1.5, 1.5);
      var ti = t.invert();

      var p1 = ti.transform(t.transform(new Entities.Point(0, 1)));
      var p2 = ti.transform(t.transform(new Entities.Point(-1, 1)));
      
      // expected points
      var ex_p1 = new Entities.Point(0, 1);
      var ex_p2 = new Entities.Point(-1, 1);

      // switch args, not that it matters
      this.isTrue(pointsNearlyEqual(ex_p1, p1));
      this.isTrue(pointsNearlyEqual(ex_p2, p2));
    }
  }
}
