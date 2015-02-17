module Base {

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
}
