/// <reference path="../base/Base.ts" />

module Entities {
  export class Point { // doesn't extend Base.Entity?
    constructor(public x: number, public y: number) {}

    distance(pt: Point) {
      return Math.sqrt(this.norm(pt));
    }

    norm(pt: Point) {
      return Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2);
    }
  }
}
