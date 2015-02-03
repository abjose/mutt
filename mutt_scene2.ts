
class Transform {
  // maybe make constructor take an object
  tx: number; ty: number;
  sx: number; sy: number;
  // rotation: number; // don't do rotation for now...
}

// really need scene graph? Could go back to just a single z-index for a single
// layer or whatever...

// maybe better to do anything fancy in the constructor, then just assume
// can simply iterate through children list?
// so like could create children, translate, etc...
// and then drawing would be done purely externally
// so maybe clearer distinction between primitive and non-primitive things
// this kinda seems more inline with other graphic libs....
// everything is just a composition of transformed primitives
// so only leaves are rendered
// internal nodes are transforms I guess
// maybe should just be another part of MultiIndex - TransformGraph / DAG?
// So...could have something like
// Primitive (Line, Rectangle, Circle, Image, TextArea, ...)
// Entity (as before)
// Or...change Entity to Group? Why exactly is group useful?...
// Also Transform...
// Examples of times when Primitives aren't 'primitive'?
// -> Example: when a library being wrapped implements some high-level thing,
// like want to have a BoxWithButton and the library happens to implement that.

class TransformStack {
  transforms: Transform[];
  push_index: number;

  push() { this.push_index = this.transforms.length; }
  pop() { this.transforms.slice(0, this.push_index); }

  add(transform: Transform) {
    this.transforms.push(transform); // should get a copy? think unneeded
  }
  get() {
    // multiply them all together
    // ideally should do some caching or something...later.
  }
}

interface Entity {
  type: string;
  style: string;
  draw(.......);

  // Relation
  contains(transform??);
  intersects(transform??);
  distance(transform??);
}

class Rectangle {
  type = 'Rectangle';
  style = 'div';
  constructor(public x: number, public y: number,
	      public w: number, public h: number) {}

  draw() {
    var style = blah.get_style(this);
    style.draw(this);
  }

  // for a textbox with a button
  draw() {
    transform.push();
    
    this.container.draw();
    this.textbox.draw();
    this.button.draw();
    transform.pop();
  }
}

class View {
  constructor(public view_rect: Rectangle, public render_rect: Rectangle) {

  }

  draw() {
    
  }
}

interface Style {
  draw(entity: Entity, transform: Transform);
}

// consider adding a template or something
class DivRect implements Style {
  //draw(rect: Rectangle) {
  draw(rect: Entity) {

  }
}

interface TypeToStyle { [entity_type: string]: Style; }
interface StyleCollection { [style_type: string]: TypeToStyle; }
class StyleManager {
  styles: StyleCollection;

  constructor() {
    var div_styles = { 'rect': new DivRect() };
    this.styles = {
      'div': div_styles,
    };
  }
  
  draw(entity: Entity, transform: Transform) {
    var style = this.get_style(entity);
    style.draw(entity, transform);
  }

  get_style(entity: Entity) {
    return this.styles[entity.style][entity.type];
  }
}

var mutt = {
  styles: new StyleManager();
  transforms: new TransformStack(); //?
  scene: new Scene(); //Entity(); // perhaps replace with collection of scenes
}

var rect = new Rectangle(5, 10, 10, 20);
mutt.scene.add_child(rect);
mutt.scene.draw();
