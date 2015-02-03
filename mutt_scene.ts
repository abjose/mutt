
class Transform {
  // maybe make constructor take an object
  tx: number; ty: number;
  sx: number; sy: number;
  // rotation: number; // don't do rotation for now...
}

// really need scene graph? Could go back to just a single z-index for a single
// layer or whatever...

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

class Entity {
  type: string;
  style: string;
  draw() {
    throw new Error('This method is abstract'); // ??
  }
  
  // Node
  parent: Entity;
  children: Entity[];
  // maybe have children directly on Entity, but have their names in a list?
  // still hard to customize rendering of each one...
  // could have special Children class that helps with changing order, etc.
  add_child(child: Entity) {
    if (this.children == undefined) this.children = [];
    this.children.push(child);
    child.parent = this;
  }

  // Relation
  contains();
  intersects();
  distance();
}

interface Style {
  draw(entity: Entity, transform: Transform);
  // consider adding relations
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
    // euhhhhhh
    styles = {
      'div': {
	'rect': Blah,
      },
    };
  }
  
  draw(entity: Entity) {
    var style = this.get_style(entity);
    style.draw(entity, ...);
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
