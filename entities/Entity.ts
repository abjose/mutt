
module Entity {
  
  // interface Component {
  //     points: Point[];
  //     transform: Transform;
  // }

  // interface EntityGroup {...}
  // figure out how to put these in-line
  interface StyleMap { [name: string]: Style.EntityStyle; }
  //interface ComponentMap { [name: string]: Component; }
  interface ComponentMap { [name: string]: any; }

  export class Entity {
    //z_index: number;
    //components: ComponentMap;

    // consider adding ...contains(pt), inside(rect)
    // move(x, y) or something (and also getters...or change that)
    // getTransformed(...view, render)

    // ok, I guess can try out having style stuff in here...
    styles: StyleMap;
    prev_style: string;
    curr_style: string;

    render(scene: Scene.Scene) {
      this.styles[this.curr_style].render(this, scene);
    }

    clear(scene: Scene.Scene) {
      this.styles[this.prev_style].clear(this, scene);
    }
  }

 
}

module Style {
  export interface EntityStyle {
    name: string;
    render(entity: Entity.Entity, scene: Scene.Scene): void;
    clear(entity: Entity.Entity, scene: Scene.Scene): void;
  }
}
