{
	
	let curDrag = {
		zIndex: 1,
		obj: ''
	}

	let hasRegister = false // 防止在document上重复注册事件

	const defaultOptions = {
		direction: 'all',
		handler: '',
		dragStart: '',
		dragEnd: '',
		dragMove: '',
	}

	class Drag {
		constructor(el, options) {
			this.el = el
			this.options = options || defaultOptions
			this.diffX = null
			this.diffY = null

			if (getStyle(this.el, 'position') !== 'absolute') {
				this.el.style.position = 'absolute'
			}

			this.x = Number(getStyle(this.el, 'left').replace(/px/, ''))
			this.y = Number(getStyle(this.el, 'top').replace(/px/, ''))


			this.init()
		}
		init() {
			this.el.onselectstart = function() {
				return false
			}

			this.throttleUpdateFn()
			this.initEvent()
		}
		initEvent() {
			if (this.options.handler) {
				this.options.handler.addEventListener('mousedown', (e) => {
					this.dragStart(e)
				})
			} else {
				this.el.addEventListener('mousedown', (e) => {
					this.dragStart(e)
				})
			}

			if (!hasRegister) {
				document.addEventListener('mousemove', (e) => {
					this.dragMove(e)
				})
				document.addEventListener('mouseup', (e) => {
					this.dragEnd(e)
				})
			}

			hasRegister = true
		}
		dragStart(e) {
			this.diffX = e.clientX - this.el.offsetLeft
			this.diffY = e.clientY - this.el.offsetTop

			curDrag.obj = this

			curDrag.obj.el.style.zIndex = curDrag.zIndex++

			if (curDrag.obj.options.dragStart) {
				curDrag.obj.options.dragStart.call(curDrag.obj, curDrag.obj.x, curDrag.obj.y)
			}
		}
		dragMove(e) {
			if (curDrag.obj) {
				switch (curDrag.obj.options.direction) {
					case 'x':
						this.updateX(e)
						break;
					case 'y':
						this.updateY(e)
						break;
					default:
						this.updateAll(e)
						break;
				}
			}
		}
		dragEnd(e) {
			if (curDrag.obj && curDrag.obj.options.dragEnd) {
				curDrag.obj.options.dragEnd.call(curDrag.obj, curDrag.obj.x, curDrag.obj.y)
			}
			curDrag.obj = null
		}
		throttleUpdateFn() {
			this.updateX = throttle(this.updateX, 30)
			this.updateY = throttle(this.updateY, 30)
			this.updateAll = throttle(this.updateAll, 30)
		}
		updateX(e) {
			if (!curDrag.obj) {
				return
			}

			curDrag.obj
				.setXY(e.clientX - curDrag.obj.diffX, null)
				.css({
					left: curDrag.obj.x + 'px'
				})

			if (curDrag.obj.options.dragMove) {
				curDrag.obj.options.dragMove.call(curDrag.obj, curDrag.obj.x, curDrag.obj.y)
			}
		}
		updateY(e) {
			if (!curDrag.obj) {
				return
			}

			curDrag.obj
				.setXY(null, e.clientY - curDrag.obj.diffY)
				.css({
					top: curDrag.obj.y + 'px'
				})

			if (curDrag.obj.options.dragMove) {
				curDrag.obj.options.dragMove.call(curDrag.obj, curDrag.obj.x, curDrag.obj.y)
			}
		}
		updateAll(e) {
			if (!curDrag.obj) {
				return
			}

			curDrag.obj
				.setXY(e.clientX - curDrag.obj.diffX, e.clientY - curDrag.obj.diffY)
				.css({
					top: curDrag.obj.y + 'px',
					left: curDrag.obj.x + 'px'
				})

			if (curDrag.obj.options.dragMove) {
				curDrag.obj.options.dragMove.call(curDrag.obj, curDrag.obj.x, curDrag.obj.y)
			}
		}
		setXY(x, y) {
			x && (this.x = x)
			y && (this.y = y)

			return this
		}
		css(options) {
			for (let key in options) {
				this.el.style[key] = options[key]
			}

			return this
		}
	}

	window.Drag = Drag
}