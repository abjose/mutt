/// <reference path="libs/gl-matrix.d.ts" />
/// <reference path="utility/uuid.ts" />
/// <reference path="base/Entity.ts" />
/// <reference path="base/Style.ts" />
/// <reference path="base/Transform.ts" />
/// <reference path="entities/Line.ts" />
/// <reference path="entities/Point.ts" />
/// <reference path="entities/Rectangle.ts" />
/// <reference path="styles/Rectangle/DivRect.ts" />
/// <reference path="styles/Line/CanvasLine.ts" />

// caution!! changed Transform to not use Points!!!

var paw = {
  transform: new Base.TransformStack(),
  styles: new Base.StyleManager(),
  draw(entity: Base.Entity) {
    this.styles.draw(entity, this.transform.get());
  },
};

// Could put these in StyleManager constructor
paw.styles.add_style(new Style.DivRect());
paw.styles.add_style(new Style.CanvasLine());
