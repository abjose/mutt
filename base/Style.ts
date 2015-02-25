
module Base {
  export interface Style<EntityType> {
    style: string;
    type: string; // change these names...
    draw(entity: EntityType, transform: Base.Transform);
    // consider adding relations and stuff
  }

   /*
    Hmm, isn't this pretty specific to Paw? Things probably shouldn't be
    so mixed together...
   */
  
  interface StyleToDrawer { [style_type: string]: Base.Style<any>; }
  interface StyleCollection { [entity_type: string]: StyleToDrawer; }
  export class StyleManager {
    styles: StyleCollection; // [entity_type][style_type] -> Style

    constructor() {
      this.styles = {};
    }
    
    draw(entity, transform: Base.Transform) {
      this.get_style(entity).draw(entity, transform);
    }

    get_style(entity) {
      return this.styles[entity.type][entity.style];
    }

    add_style(style: Base.Style<any>) {
      if (this.styles[style.type] == undefined) this.styles[style.type] = {};
      this.styles[style.type][style.style] = style;
    }
  } 
}
