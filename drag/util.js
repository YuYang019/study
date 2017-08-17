function addEvent(el, type, handler) {
	if (el.addEventListener) {
		el.addEventListener(type, handler, false)
	} else if (el.attachEvent) {
		el.attachEvent('on' + type, handler)
	} else {
		el['on' + type] = handler
	}
}

function removeEvent(el, type, handler) {
	if (el.addEventListener) {
		el.removeEventListener(type, handler, false)
	} else if (el.attachEvent) {
		el.detachEvent('on' + type, handler)
	} else {
		el['on' + type] = null
	}
}

function getStyle(el, name) {
	if (el.currentStyle) {
		return el.currentStyle[name]
	} else {
		return getComputedStyle(el, false)[name]
	}
}

function throttle(method, delay) {
	//let timer = null
	let begin = new Date()
	return function(...args) {
		let currTime = new Date()
			//clearTimeout(timer)
		if (currTime - begin >= delay) {
			method.apply(this, args)
			begin = currTime
		}
		//else {
		// timer = setTimeout(() => {
		// 	method.apply(this, args)
		// }, delay)
		//}

	}
}