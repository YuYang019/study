window.requestAnimationFrame = window.requestAnimationFrame || 
							   window.mozRequestAnimationFrame || 
							   window.webkitRequestAnimationFrame || 
							   window.msRequestAnimationFrame

function Circle(x, y) {
	this.x = x //圆点x坐标
	this.y = y //圆点y坐标
	this.r = Math.random() * 10
	this._mx = Math.random()
	this._my = Math.random()
}

Circle.prototype = {
	constructor: Circle,
	drawCircle: function(ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.r, 0, 360)
		ctx.closePath()
		ctx.fillStyle = 'rgba(204, 204, 204, 0.3)'
		ctx.fill()
	},
	drawCurrentCircle: function(ctx) {
		ctx.beginPath()
		this.r = 3
		ctx.arc(this.x, this.y, this.r, 0, 360)
		ctx.closePath()
		ctx.fillStyle = 'rgba(204, 204, 204, 0.3)'
		ctx.fill()
	},
	drawLine: function(ctx, _circle) {
		var dx = this.x - _circle.x
		var dy = this.y - _circle.y
		var d = Math.sqrt(dx * dx + dy * dy)

		if (d < 200) {
			ctx.beginPath()
			ctx.moveTo(this.x, this.y)
			ctx.lineTo(_circle.x, _circle.y)
			ctx.closePath()
			ctx.strokeStyle = 'rgba(204, 204, 204, 0.1)'
			ctx.stroke()
		}
	},
	move: function(w, h) {
		this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx)
		this._my = (this.y < h && this.y > 0) ? this._my : (-this._my)
		this.x += this._mx / 3
		this.y += this._my / 3
	}
}

var c = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var w = c.width = c.offsetWidth
var h = c.height = c.offsetHeight
var circles = []
var current_circle = new Circle(0,0)

var draw = function() {
	ctx.clearRect(0, 0, w, h)
	for (var i = 0; i < circles.length; i++) {
		circles[i].move(w, h)
		circles[i].drawCircle(ctx)
		for (var j = i + 1; j < circles.length; j++) {
			circles[i].drawLine(ctx, circles[j])
		}
	}
	if (current_circle.x) {
		current_circle.drawCurrentCircle(ctx)
		for (var k = 1; k < circles.length; k++) {
			current_circle.drawLine(ctx, circles[k])
		}
	}
	requestAnimationFrame(draw)
}

var init = function(num) {
	for (var i = 0; i < num; i++) {
		circles.push(new Circle(Math.random() * w, Math.random() * h))
	}
	draw()
}

window.addEventListener('load', init(60))

window.onmousemove = function(e) {
	e = e || window.event
	current_circle.x = e.clientX;
	current_circle.y = e.clientY
}

window.onmouseout = function() {
	current_circle.x = null
	current_circle.y = null
}
