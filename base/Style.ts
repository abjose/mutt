
module Base {
  export interface Style<EntityType> {
    style: string;
    entity: string; // change these names...
    draw(entity: EntityType, transform: Base.Transform);
    // consider adding relations and stuff
  }
}
