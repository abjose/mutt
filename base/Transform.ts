
module Base {
  /* TODO
     - add 'origin'? And do translations before/after other things.
     - maybe nice to have both a set_pos(...) and move(...) fns
     - convert so that contain the actual values for rotation, translation, etc.
       and only generate actual transform when necessary (like could have
       getter for .T or something?). This way can just look up individual
       values where that's more important (like when need to make CSS transform)
       But this won't quite work for combining transforms...
       Unless expect sort of non-standard behavior from transforms - like
       basically assume everything is additive...
       Or, could just allow parameters to be accessed for directly constructing
       CSS transforms.
       Alternately could add something to look at the matrix and output
       how much it would rotate, translate, etc.
  */
  
  export class Transform {
    //protected T: Float32Array;
    T: Float32Array;
    
    constructor() {
      this.T = mat2d.create();
    }
    copy() {
      var T = new Transform();
      mat2d.copy(T.T, this.T);
      return T;
    }
    matrixString() {
      // maybe just loop
      return String(this.T[0]) + ','+String(this.T[1])
	+ ','+String(this.T[2]) + ','+String(this.T[3])
	+ ','+String(this.T[4]) + ','+String(this.T[5]);
    }

    // Rather than directly transforming T, transform the identity matrix
    // and then set T = I*T, so that transforms happen in intuitive order.
    rotate(rad: number) {
      var I = mat2d.create();
      mat2d.rotate(I, I, rad);
      mat2d.mul(this.T, I, this.T);
    }
    scale(sx: number, sy: number) {
      var I = mat2d.create();
      mat2d.scale(I, I, new Float32Array([sx, sy]));
      mat2d.mul(this.T, I, this.T);
    }
    translate(tx: number, ty: number) {
      var I = mat2d.create();
      mat2d.translate(I, I, new Float32Array([tx, ty]));
      mat2d.mul(this.T, I, this.T);
    }

    invert() {
      var T = new Transform();
      mat2d.invert(T.T, this.T);
      return T;
    }
    multiply(other: Transform) {
      // return this * other
      var T = new Transform();
      mat2d.multiply(T.T, this.T, other.T);
      return T;
    }
    mul(other: Transform) {
      return this.multiply(other);
    }
    //transform(pt: Entity.Point) {
    transform(pt) {
      // return transformed copy of pt
      var temp_pt = vec2.fromValues(pt.x, pt.y);
      vec2.transformMat2d(temp_pt, temp_pt, this.T);
      //return new Entities.Point(temp_pt[0], temp_pt[1]);
      return {x: temp_pt[0], y: temp_pt[1]};
    }

    transform_points(pts) {
      var out_pts = []
      for (var i = 0; i < pts.length; i++)
	out_pts.push(this.transform(pts[i]));
      return out_pts;
    }
  }

  interface EntityToNodeMap { [entity_id: string]: TransformNode; }
  export class TransformHierarchy {
    // TODO: decide if can have multiple copies of a single entity in hierarchy
    // TODO: decide if tree or DAG or whatever, add checks for that.
    root: TransformNode;
    entity_to_node: EntityToNodeMap;

    constructor() {
      this.root = new TransformNode();
      this.entity_to_node = {};
    }

    add_entity(entity: Base.Entity) {
      this.entity_to_node[entity.id] = new TransformNode();
      this.entity_to_node[entity.id].parent = this.root;
    }

    remove_entity(entity: Base.Entity) {
      var node = this.get_node(entity);
      node.parent.remove_child(node);
      delete this.entity_to_node[entity.id];
      this.entity_to_node[entity.id] = undefined;  // necessary?
    }

    get_node(entity: Base.Entity): TransformNode {
      return this.entity_to_node[entity.id];
    }

    set_relation(parent: Base.Entity, child: Base.Entity) {
      // TODO: check to make sure adding relation won't ruin graph/tree
      var parent_node = this.get_node(parent);
      var child_node  = this.get_node(child);
      // remove old relation
      child_node.parent.remove_child(child_node);
      // create new relation
      parent_node.add_child(child_node);
      child_node.set_parent(parent_node);
    }

    get_transform(entity: Base.Entity) {
      return this.get_node(entity).transform;
    }

    get_common_ancestor(a: TransformNode, b: TransformNode): TransformNode {
      var seen = {};  // seen node ids
      while (true) {
	if (a.id in seen) return a;
	seen[a.id] = true;
	if (b.id in seen) return b;
	seen[b.id] = true;
	if (a.id != this.root.id) a = a.parent;
	if (b.id != this.root.id) b = b.parent;
      }
    }

    get_path(a: TransformNode, b: TransformNode): TransformNode[] {
      // Build paths to common ancestor.
      var ca = this.get_common_ancestor(a, b);
      var a_path = [], b_path = [];
      while (a.id != ca.id) {
	a_path.push(a);
	a = a.parent;
      }
      while (b.id != ca.id) {
	b_path.push(b);
	b = b.parent;
      }

      // Append paths and return.
      return a_path.concat(ca, b_path.reverse());
    }

    transform_between(a: Base.Entity, b: Base.Entity): Base.Transform {
      var path = this.get_path(this.get_node(a), this.get_node(b));
      return this.transform_from_path(path);
    }

    transform_from_root(entity: Base.Entity) {
      var path = this.get_path(this.root, this.get_node(entity));
      return this.transform_from_path(path); 
    }

    transform_to_root(entity: Base.Entity) {
      return this.transform_from_root(entity).inverse();
    }

    transform_from_path(path: TransformNode[]) {
      return path.reduce(function(transform, node) {
	return transform.multiply(node.transform);
      }, new Base.Transform());
    }
  }

  interface ChildrenMap { [node_id: string]: TransformNode }
  class TransformNode {
    // TODO: do some kind of cacheing
    transform: Base.Transform;
    parent: TransformNode;
    children: ChildrenMap;
    id: string;

    constructor() {
      this.transform = new Base.Transform();
      this.parent = undefined;
      this.children = {};
      this.id = Utility.UUID();
    }

    set_parent(parent: TransformNode) {
      this.parent = parent;
    }

    add_child(child: TransformNode) {
      this.children[child.id] = child;
    }

    remove_child(child: TransformNode) {
      this.children[child.id] = undefined;
    }

    get_children() {
      return Object.keys(this.children).map(function (id) {
	return this.children[id];
      });
    }
  }


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
