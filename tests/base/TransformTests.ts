/// <reference path="../../libs/tsUnit.ts" />
/// <reference path="../../base/Transform.ts" />
/// <reference path="../../entities/Point.ts" />

module Tests {
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

      this.areIdentical([p1.x, p1.y], [0, 1]); // better way?
      this.areIdentical([p2.x, p2.y], [-1, 1]);
    }
    
    transformPoint() {
      var t = new Base.Transform();
      t.translate(2, 2);
      t.rotate(3.14);
      t.scale(1.5, 1.5);

      var p1 = t.transform(new Entities.Point(0, 1));
      var p2 = t.transform(new Entities.Point(-1, 1));

      this.areIdentical([p1.x, p1.y], []);
      this.areIdentical([p2.x, p2.y], []);
    }

    testInversionUndoesTransform() {
      var t = new Base.Transform();
      t.translate(2, 2);
      t.rotate(3.14);
      t.scale(1.5, 1.5);
      var ti = t.invert();

      var p1 = ti.transform(t.transform(new Entities.Point(0, 1)));
      var p2 = ti.transform(t.transform(new Entities.Point(-1, 1)));

      this.areIdentical([p1.x, p1.y], [0, 1]);
      this.areIdentical([p2.x, p2.y], [-1, 1]);
    }
  }
}
