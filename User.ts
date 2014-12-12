
module User {

  export class User {
    IH: InputHandler;

    constructor() {
      this.IH = new InputHandler();
    }
  }
  
  class InputHandler {
  //var Key = {
    pressed = {};
    mouse_down = false;
    mouse_x = 0;
    mouse_y = 0;

    LEFT = 37;
    UP = 38;
    RIGHT = 39;
    DOWN = 40;

    constructor() {
      // careful about usage of 'this' here - is it correct?
      window.addEventListener('keyup',
			      function(event) { this.onKeyup(event); }, false);
      window.addEventListener('keydown',
			      function(event) { this.onKeydown(event); }, false);
      window.addEventListener('mousedown',
			      function(event) { this.onMousedown(event); }, false);
      window.addEventListener('mouseup',
			      function(event) { this.onMouseup(event); }, false);
      window.addEventListener('mousemove',
			      function(event) { this.onMouseMove(event); }, false);
    }
    
    isKeyDown(keyCode) {
      return this.pressed[keyCode];
    }
    
    onKeydown(event) {
      this.pressed[event.keyCode] = true;
    }
    
    onKeyup(event) {
      delete this.pressed[event.keyCode];
    }

    onMousedown(event) {
      this.mouse_down = true;
      scene.handle_mousedown(new Entity.Point(this.mouse_x, this.mouse_y));
    }
    
    onMouseup(event) {
      this.mouse_down = false;
      scene.handle_mouseup();
    }

    onMouseMove(event) {
      this.mouse_x = event.clientX;
      this.mouse_y = event.clientY;
      scene.handle_mousemove();
    }
  }
}
