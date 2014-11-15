var selected = null,  // Object of the element to be moved
x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
x_off = 0, y_off = 0;

var rect = {
  style: {},

  x: 10,
  y: 10,
  w: 50,
  h: 50,

  curr_style: 'div',
  prev_style: 'div',
};

rect.add_style = function() {};
rect.update_style = function() {};
rect.contains = function(x, y) {
  return (x >= this.x && y >= this.y && 
	  x <= this.x + this.w && y <= this.y + this.h);
};
rect.render = function() {
  this.style[this.curr_style].render();
};
rect.clear = function() {
  this.style[this.prev_style].clear();
}

rect.style.div = {}

rect.style.div.id = 'myDiv';
rect.style.div.parent = rect; // gross

rect.style.div.render = function() {
  this.parent.clear();
  var ele = document.getElementById(this.id);
  ele.style.left   = String(this.parent.x+1) + 'px';
  ele.style.top    = String(this.parent.y+1) + 'px';
  ele.style.width  = String(this.parent.w) + 'px';
  ele.style.height = String(this.parent.h) + 'px';
  ele.style.display = 'block';
  this.parent.prev_style = 'div';
};

rect.style.div.clear = function() {
  var ele = document.getElementById(this.id);
  ele.style.display = 'none';
};


rect.style.canvas = {};
rect.style.canvas.id = 'myCanvas';
rect.style.canvas.parent = rect; // gross
rect.style.canvas.render = function() {
  var ele = document.getElementById(this.id);
  var ctx = ele.getContext('2d');
  ctx.fillStyle="#00000";
  ctx.fillRect(this.parent.x, this.parent.y,
	       this.parent.w, this.parent.h);
  this.parent.prev_style = 'canvas';
};

rect.style.canvas.clear = function() {
  var ele = document.getElementById(this.id);
  var ctx = ele.getContext('2d');
  ctx.clearRect(this.parent.x, this.parent.y,
 	 	this.parent.w, this.parent.h);
};



/*
could store previous style so can hide correct thing when ready to render
new thing
assuming have a rect.style.<>.hide() func or clear or something

what to do about stateful info attached to styles? Less and less of an argument
for not having classes...
but...I don't think can have multiple objects beneath a parent object
and have them all access the parent object's data...
maybe rect could store div id in 'contexts' object?
*/


// Bind the functions...
// WILL HAVE TO INCLUDE THESE IN RECT ABOVE
//document.getElementById('myDiv').onmousedown = function () {
  //_drag_init(this);
//  _drag_init(rect);
//  return false;
//};


// Will be called when user starts dragging an element
function init_drag(e) {
  // Store the object of the element which needs to be moved
  x_pos = document.all ? window.event.clientX : e.pageX;
  y_pos = document.all ? window.event.clientY : e.pageY;
  if (rect.contains(x_pos, y_pos)) {
    selected = rect;
    x_off = x_pos - selected.x;
    y_off = y_pos - selected.y;
  }
}

// Will be called when user dragging an element
function move_elem(e) {
  x_pos = document.all ? window.event.clientX : e.pageX;
  y_pos = document.all ? window.event.clientY : e.pageY;
  if (selected !== null) {
    selected.clear();
    selected.x = x_pos - x_off;
    selected.y = y_pos - y_off;
    selected.render();
  }
}

// Destroy the object when we are done
function end_drag() {
  selected = null;
}


document.onmousedown = init_drag;
document.onmousemove = move_elem;
document.onmouseup = end_drag;
document.onkeypress = function(e) {
  switch (e.keyCode) {
  case 49:
    rect.clear();
    rect.curr_style = 'div';
    rect.render();
    break;
  case 50:
    // MAKE IT SO CAN CLEAR AND RENDER IN ONE CALL
    // LIKE PROBABLY HAVE A SET_POS OR SOMETHING
    // ALSO A SET_STYLE
    rect.clear();
    rect.curr_style = 'canvas';
    rect.render();
    break;
  }
}
rect.render();


/* TODO
- UPGRADE LINUX LOL....ALSO MAKE BIGGER PARTition if repart
  put things on thumb drive? deleting as you go...
  maybe also upload encrypted to drive
- allow more sensible event handling (like if style can handle events itself)
- try more classical design (TypeScript!)
- add lines, then add a rect made out of lines
- make little divs that can be dragged to resize
  and little lines around border for changing dims
  and still click to drag
- make an example XML 'document'
- work on stage/view stuff...
  just make a type of rectangle that takes two rectangles as input
  (view and display)
  (should later switch to transforms?)
  
*/