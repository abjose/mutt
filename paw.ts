/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Transform.ts" />

// caution!! changed Transform to not use Points!!!

class TransformStack {
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

interface Style {
  style: string; entity: string; // change these names...
  draw(entity, transform: Base.Transform);
  // consider adding relations and stuff
}
  
class DivRect implements Style {
  style: string; entity: string;
  secret_place: string;
  
  constructor() {
    this.entity = 'rect'; this.style = 'div';
    this.secret_place = 'STYLEDATA_' + this.style; // change this lol
  }
  
  draw(rect, transform: Base.Transform) {
    if (rect[this.secret_place] == undefined) {
      // probably make this into a function, like 'get_data'...
      rect[this.secret_place] = {};
      rect[this.secret_place].element = document.createElement('div');
      document.body.appendChild(rect[this.secret_place].element);
    }
    var ele = rect[this.secret_place].element;

    ele.style.left = String(rect.x) + 'px';
    ele.style.top  = String(rect.y) + 'px';
    ele.style.width  = String(rect.width) + 'px';
    ele.style.height = String(rect.height) + 'px';
    ele.style.backgroundColor = 'black';
    ele.style.padding = 0;
    ele.style.position = 'absolute';
    //console.log(transform.matrixString());
    // ughhhhhhh
    ele.style.webkitTransform = 'matrix('+transform.matrixString()+')';
    //ele.style.webkitTransform = 'rotate(40deg)';
    ele.style.display = 'block';
  }
  
  clear(rect, transform: Base.Transform) {
    if (rect[this.style] != undefined)
      rect[this.style].element.style.display = 'none';
  }
}

interface TypeToStyle { [entity_type: string]: Style; }
interface StyleCollection { [style_type: string]: TypeToStyle; }
class StyleManager {
  styles: StyleCollection; // [style_type][entity_type] -> Style

  constructor() {
    this.styles = {};
  }
  
  draw(entity, transform: Base.Transform) {
    this.get_style(entity).draw(entity, transform);
  }

  get_style(entity) {
    return this.styles[entity.style][entity.type];
  }

  add_style(style: Style) {
    if (this.styles[style.style] == undefined) this.styles[style.style] = {};
    this.styles[style.style][style.entity] = style;
  }
}

var paw = {
  transform: new TransformStack(),
  styles: new StyleManager(),
  //draw(entity: Entity) { // change entity to being type any?
  draw(entity) {
    this.styles.draw(entity, this.transform.get());
  },
};

/*
paw.styles.add_style(new DivRect());

var rect = {x: 10, y: 10, width: 50, height: 50,
	    style: 'div', type: 'rect'};
var rect2 = {x: 150, y: 150, width: 80, height: 50,
	     style: 'div', type: 'rect'};
// could also check to see if there was a 'transform' property on the entity?
var test_trans = new Base.Transform();
test_trans.translate(100, -10);
test_trans.rotate(3.141 * 0.25);
paw.transform.pushState();
paw.transform.add(test_trans);
paw.draw(rect);
//paw.transform.popState();
//paw.transform.add(test_trans.copy());
paw.draw(rect2);
*/
