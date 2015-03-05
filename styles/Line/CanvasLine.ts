
module Style {
  export class CanvasLine implements Base.Style<Entity.Line> {
    style: string; type: string;
    secret_place: string;
    
    constructor() {
      this.type = 'line'; this.style = 'canvas';
      this.secret_place = 'STYLEDATA_' + this.style; // change this lol
    }
    
    draw(line: Entity.Line, transform: Base.Transform) {
      if (line[this.secret_place] == undefined) {
	// probably make this into a function, like 'get_data'...
	line[this.secret_place] = {};
	line[this.secret_place].canvas = document.createElement('canvas');
	line[this.secret_place].canvas.width = '500';
	line[this.secret_place].canvas.height = '500';
	line[this.secret_place].canvas.style.position = 'absolute';
	document.body.appendChild(line[this.secret_place].canvas);
      }
      
      var canvas = line[this.secret_place].canvas;
      var ctx = canvas.getContext('2d');
      ctx.save();
      // make this suck less
      ctx.transform(transform.T[0], transform.T[1], transform.T[2],
                    transform.T[3], transform.T[4], transform.T[5]);
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
      ctx.restore();
    }
    
    clear(line, transform: Base.Transform) {}  
  }
}
