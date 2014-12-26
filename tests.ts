/// <reference path="libs/tsUnit.ts" />
/// <reference path="tests/base/TransformTests.ts" />

// new instance of tsUnit - pass in modules that contain test classes
var test = new tsUnit.Test(Tests);

// Use the built in results display
test.showResults(document.getElementById('results'), test.run());
