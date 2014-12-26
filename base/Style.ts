/// <reference path="Entity.ts" />

module Base {

  export interface Style {
    name: string;
    render(entity: Entity, scene: Scene): void;
    clear(entity: Entity, scene: Scene): void;
  }
}
