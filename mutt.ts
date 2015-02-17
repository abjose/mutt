/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="paw.ts" />
/// <reference path="utility/uuid.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/MultiIndex.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/StyleManager.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="base/TransformStack.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="styles/Rectangle/DivRect.ts" />
/// <reference path="styles/Line/CanvasLine.ts" />


/*
TODO:
- CHANGE MUTT to use scene graph rather than expecting entities to have
  their own transforms defined.

Minimal steps to prototype bootstrapping interface-creator:
- create woof so very easy to introspect/modify event settings
- at least need to add some kind of 'edit' command..and selection?
  and later these can be modified through mutt itself
- need to have some way of replicating structure of entities made in-mutt

Don't worry about bootstrapping for now. Get demo working - something
like a graph where you can select the style if each edge/node

Remember - don't worry about getting views to work in context of transform
hierarchy. Views are weird, and should just have a special draw function. Maybe.

Arguments for allowing multiple instances of a single entity in transform hier:
- simpler to have same entity in different places in multiple layers or whatever
- can like have lots of repeated entities, if that's a thing you want to do
Against:
- confusing...
- might lead to ambiguity when looking at entities
- makes events more complex
- makes storing temp objects locally more comples

Remember - liked idea of get_children that could be defined separately by 
different entities. But would need to call something more specific considering
number of interpretations of 'children'.

mutt 2du:
- add spatial relation stuff to Rect and Line?
- add simple spatial query to MultiIndex
- add clipping
- make view
- think about messenger stuff
*/

interface EntityToNodeMap { [entity_id: string]: TransformNode; }
class TransformHierarchy {
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

var mutt = {
  entities: new Base.MultiIndex(),
  scene: new TransformHierarchy(),  // better name?

  update: function() {
    var entities_to_draw = this.entities.query();
    for (var id in entities_to_draw) {
      if (entities_to_draw.hasOwnProperty(id)) {
	this.draw(entities_to_draw[id]);
      }
    }
  },
  
  draw: function(entity) {
    // sure you want this? Could just force all entities to define 'draw'
    var has_draw = entity.draw != undefined;

    paw.transform.pushState();
    //paw.transform.add(entity.transform);
    paw.transform.add(this.scene.transform_from_root(entity));
    
    if (has_draw) {
      entity.draw();
    } else {
      paw.draw(entity);
    }
    
    paw.transform.popState();
  },

  add: function(entity) {
    this.entities.put(entity);  // change to add?
    this.scene.add_entity(entity);
  },

  remove: function(entity) {
    this.entities.remove(entity);
    this.scene.remove_entity(entity);
  },
}
