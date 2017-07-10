export function isObject (obj) {
	return obj !== null && typeof obj === 'object'
}

export function isArray (array) {
	return Object.prototype.toString.call(array) === '[object Array]'
}

export function toArray (arrayLike) {
	let i = arrayLike.length
	let arr = new Array(i)

	while (i--) {
		arr[i] = arrayLike[i]
	}

	return arr
}

export function extend (to, from) {
	for (const key in from) {
		to[key] = from[key]
	}
	return to
}

export function hasProto () {
	return '__proto__' in {}
}

export function isElementNode (node) {
	return node.nodeType === 1
}

export function isTextNode (node) {
	return node.nodeType === 3
}

export function isDirective (attr) {
	return attr.indexOf('v-') === 0 || attr.indexOf('@') === 0
}

// on:click/click
export function isEventDirective (dir) {
	return dir.indexOf('on:') === 0 || dir === 'click'
}

// v-on:click , @click , v-model , 三种情况， 返回 v- 之后的或者 click
export function getDir (attrName) {
	return attrName.indexOf('@') === 0
		? attrName.substring(1)
		: attrName.substring(2)
}

export function nodeToFragment (el) {
	let fragment = document.createDocumentFragment()
	let child = el.firstChild
	while (child) {
		fragment.appendChild(child) //注意append之后，el里的原节点会消失
		child = el.firstChild
	}
	return fragment
}

export function replace (oldnode, newnode) {
	let parent = oldnode.parentNode

	if (parent) {
		parent.replaceChild(newnode, oldnode)
	}
}