

class DivRect implements EntityStyle {
    name = 'div';
    element: HTMLElement;

    constructor() {
	this.element = document.getElementById('myDiv');
    }

    render(entity: Entity) {
	var tl = entity.components['top-left'];
	var br = entity.components['bottom-right'];
	this.element.style.left   = String(tl.x) + 'px';
	this.element.style.right  = String(br.x) + 'px';
	this.element.style.top    = String(tl.y) + 'px';
	this.element.style.bottom = String(br.y) + 'px';
	this.element.style.display = 'block';
	this.entity.prev_style = 'div';
    }

    clear() {
	this.element.style.display = 'none';
    }
}
