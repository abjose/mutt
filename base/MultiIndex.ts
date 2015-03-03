module Base {
  export class MultiIndex {
    // very simple for now
    // TODO: improve IDs
    // TODO: add more indices (particularly for assisting view)
    // TODO: switch query to taking a query object like before

    index: any;
    
    constructor() {
      this.index = {};
    }
    
    put(entity) {
      entity['id'] = Utility.UUID();
      this.index[entity.id] = entity; // lol
    }
    
    get(id) {
      return this.index[id];
    }
    
    remove(entity) {
      delete this.index[entity.id];
    }

    query() {
      return this.index; // TODO: lol
    }
  }
}
