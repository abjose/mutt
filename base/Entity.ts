
module Base {
  // be a class??
  export interface Entity {
    id: string;
    type: string;
    style: string;

    to_geo(): Geometry.Primitive;
    
    // could put style-extraction stuff if were class...
  }
}
