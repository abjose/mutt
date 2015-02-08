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

// be a class??
interface Entity {
  type: string;
  style: string;

  // could put style-extraction stuff if were class...
}

class Point implements Entity {
  type: string;
  style: string;
  //x: number; y: number;
  constructor(public x, public y) {
    this.type = 'point';
    //this.style = args.style;
    this.style = '';
  }
}

class Rectangle implements Entity {
  type: string;
  style: string;
  x: number; y: number;
  width: number; height: number;

  constructor(args) {
    this.x = args.x; this.y = args.y
    this.width = args.width; this.height = args.height;
    this.type = 'rect';
    this.style = args.style;
  }
}

class Line implements Entity {
  type: string;
  style: string;
  start: Point;
  end: Point;
  
  constructor(args) {
    this.start = args.start;
    this.end = args.end;
    this.type = 'line';
    this.style = args.style;
  }
}

interface Style<EntityType> {
  style: string; entity: string; // change these names...
  draw(entity: EntityType, transform: Base.Transform);
  // consider adding relations and stuff
}
  
class DivRect implements Style<Rectangle> {
  style: string; entity: string;
  secret_place: string;
  
  constructor() {
    this.entity = 'rect'; this.style = 'div';
    this.secret_place = 'STYLEDATA_' + this.style; // change this lol
  }
  
  draw(rect: Rectangle, transform: Base.Transform) {
    if (rect[this.secret_place] == undefined) {
      // probably make this into a function, like 'get_data'...
      rect[this.secret_place] = {};
      rect[this.secret_place].element = document.createElement('div');
      rect[this.secret_place].element.style.backgroundColor = 'black';
      rect[this.secret_place].element.style.padding = 0;
      rect[this.secret_place].element.style.position = 'absolute';
      rect[this.secret_place].element.style.display = 'block';
      document.body.appendChild(rect[this.secret_place].element);
    }
    var ele = rect[this.secret_place].element;
    ele.style.left = '0px';
    ele.style.top  = '0px';
    ele.style.width  = String(rect.width) + 'px';
    ele.style.height = String(rect.height) + 'px';
    ele.style.webkitTransformOrigin = 'top left';
    // do some silly stuff because CSS transform is local to div...
    ele.style.webkitTransform =
      'matrix('+transform.matrixString()+') '+
      'translate('+rect.x+'px,'+rect.y+'px)';
  }
  
  clear(rect: Rectangle, transform: Base.Transform) {
    if (rect[this.style] != undefined)
      rect[this.style].element.style.display = 'none';
  }
}

class CanvasLine implements Style<Line> {
  style: string; entity: string;
  secret_place: string;
  
  constructor() {
    this.entity = 'line'; this.style = 'canvas';
    this.secret_place = 'STYLEDATA_' + this.style; // change this lol
  }
  
  draw(line: Line, transform: Base.Transform) {
    if (line[this.secret_place] == undefined) {
      // probably make this into a function, like 'get_data'...
      line[this.secret_place] = {};
      line[this.secret_place].canvas = document.createElement('canvas');
      line[this.secret_place].canvas.width = '1000';
      line[this.secret_place].canvas.height = '1000';
      document.body.appendChild(line[this.secret_place].canvas);
    }
    
    var canvas = line[this.secret_place].canvas;
    var ctx = canvas.getContext('2d');
    ctx.save();
    // make this suck less
    ctx.transform(transform.T[0], transform.T[1], transform.T[2],
                  transform.T[3], transform.T[4], transform.T[5]);
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.end.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
    ctx.restore();
  }
  
  clear(line, transform: Base.Transform) {}  
}

interface TypeToStyle { [entity_type: string]: Style<any>; }
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

  add_style(style: Style<any>) {
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

paw.styles.add_style(new DivRect());
paw.styles.add_style(new CanvasLine());
