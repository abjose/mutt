module Style {
  export class DivRect implements Base.Style<Entity.Rectangle> {
    style: string; type: string;
    secret_place: string;
    
    constructor() {
      this.type = 'rect'; this.style = 'div';
      this.secret_place = 'STYLEDATA_' + this.style; // change this lol
    }
    
    draw(rect: Entity.Rectangle, transform: Base.Transform) {
      if (rect[this.secret_place] == undefined) {
	// probably make this into a function, like 'get_data'...
	rect[this.secret_place] = {};
	rect[this.secret_place].element = document.createElement('div');
	rect[this.secret_place].element.style.backgroundColor = 'black';
	rect[this.secret_place].element.style.padding = 0;
	rect[this.secret_place].element.style.position = 'absolute';
	rect[this.secret_place].element.style.display = 'block';
	document.body.appendChild(rect[this.secret_place].element);
      }
      var ele = rect[this.secret_place].element;
      ele.style.left = '0px';
      ele.style.top  = '0px';
      ele.style.width  = String(rect.width) + 'px';
      ele.style.height = String(rect.height) + 'px';
      ele.style.webkitTransformOrigin = 'top left';
      // do some silly stuff because CSS transform is local to div...
      ele.style.webkitTransform =
	'matrix('+transform.matrixString()+') '+
	'translate('+rect.x+'px,'+rect.y+'px)';
    }
    
    clear(rect: Entity.Rectangle, transform: Base.Transform) {
      if (rect[this.style] != undefined)
	rect[this.style].element.style.display = 'none';
    }
  }
}
