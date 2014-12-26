/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/Scene.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="base/User.ts" />
/// <reference path="input/Input.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="entities/View.ts" />

/// <reference path="libs/tsUnit.ts" />
/// <reference path="tests/base/TransformTests.ts" />


// new instance of tsUnit - pass in modules that contain test classes
var test = new tsUnit.Test(Tests);

// Use the built in results display
test.showResults(document.getElementById('results'), test.run());
