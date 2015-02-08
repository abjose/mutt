module Base {
  export class TransformStack {
    transforms: Base.Transform[];
    push_index: number;

    constructor() {
      this.transforms = [];
      this.push_index = undefined;
    }
    
    pushState() {
      this.push_index = this.transforms.length;
    }
    popState() {
      if (this.push_index != undefined) {
	this.transforms = this.transforms.slice(0, this.push_index);
      }
    }

    add(transform: Base.Transform) {
      this.transforms.push(transform); // should get a copy? think unneeded
    }
    get() {
      // TODO: cache stuff
      var T = new Base.Transform();
      for (var i = 0; i < this.transforms.length; i++) {
	T = T.mul(this.transforms[i]);
      }
      return T;
    }
  }
}
