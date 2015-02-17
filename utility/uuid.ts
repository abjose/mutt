module Utility {
  // generate a random 'guid'
  // stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  export function UUID() {
    var d = performance.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
  }
}
