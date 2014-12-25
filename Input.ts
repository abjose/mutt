/// <reference path="Base.ts" />

module Input {

  export class InputHandler {
    //var Key = {
    pressed = {};
    mouse_down = false;
    mouse_x = 0;
    mouse_y = 0;

    LEFT = 37;
    UP = 38;
    RIGHT = 39;
    DOWN = 40;

    constructor(public scene: Base.Scene) {
      // DON'T REALLY LIKE PASSING IN A SCENE...
      var self = this;
      window.addEventListener('keyup',
			      function(event) { self.onKeyup(event); }, false);
      window.addEventListener('keydown',
			      function(event) { self.onKeydown(event); }, false);
      window.addEventListener('mousedown',
			      function(event) { self.onMousedown(event); }, false);
      window.addEventListener('mouseup',
			      function(event) { self.onMouseup(event); }, false);
      window.addEventListener('mousemove',
			      function(event) { self.onMouseMove(event); }, false);
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
      this.scene.handle_mousedown(new Entities.Point(this.mouse_x, this.mouse_y));
    }
    
    onMouseup(event) {
      this.mouse_down = false;
      this.scene.handle_mouseup();
    }

    onMouseMove(event) {
      this.mouse_x = event.clientX;
      this.mouse_y = event.clientY;
      this.scene.handle_mousemove(new Entities.Point(this.mouse_x, this.mouse_y));
    }

  }
}
