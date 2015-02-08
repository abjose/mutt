
module Base {

  /*
    Hmm, isn't this pretty specific to Paw? Things probably shouldn't be
    so mixed together...
   */
  
  interface TypeToStyle { [entity_type: string]: Base.Style<any>; }
  interface StyleCollection { [style_type: string]: TypeToStyle; }
  export class StyleManager {
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

    add_style(style: Base.Style<any>) {
      if (this.styles[style.style] == undefined) this.styles[style.style] = {};
      this.styles[style.style][style.entity] = style;
    }
  } 
}
