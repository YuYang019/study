/**
 * 编译解析html
 */

import Watcher from './watcher'

import {
	toArray,
	isElementNode,
	isTextNode,
	isDirective,
	isEventDirective,
	getDir,
	nodeToFragment,
	replace
} from './util/util'

import {
	parseText,
	processToken,
} from './parse/parse'

/**
 * 构造函数
 * @param {DOM} el DOM节点
 * @param {Vue} vm vm实例
 */
function Compile (el, vm) {
	this.vm = vm
	this.el = el
	this.fragment = null

	this._init()
}

Compile.prototype._init = function () {
	if (this.el) {
		this.fragment = nodeToFragment(this.el)
		this.compile(this.fragment)
		this.el.appendChild(this.fragment)
	} else {
		console.error('DOM节点不存在')
	}
}

Compile.prototype.compile = function (el) {
	let child = el.childNodes;
	let that = this;
	//[].slice 建立副本
	[].slice.call(child).forEach(node => {
		let reg = /\{\{(.*)\}\}/
		let text = node.textContent

		if (isElementNode(node)) {
			that.compileElement(node)
		} else if (isTextNode(node) && reg.test(text)) {
			that.compileText(node, text)
		}

		// 递归遍历
		if (node.childNodes && node.childNodes.length) {
			that.compile(node)
		}
	})
}

Compile.prototype.compileElement = function (node) {
	let attrs = node.attributes
	let that = this
	Array.prototype.forEach.call(attrs, function(attr) {
		let attrName = attr.name
		if (isDirective(attrName)) {
			let exp = attr.value //v-on:click = "abc",取得methods函数名abc
			let dir = getDir(attrName)
			if (isEventDirective(dir)) {
				that.compileEvent(node, that.vm, exp, dir)
			} else {
				// v-model
				that.compileModel(node, that.vm, exp, dir)
			}
			node.removeAttribute(attrName)
		}
	})
}

Compile.prototype.compileText = function (node, text) {
	let that = this
	let frag = document.createDocumentFragment()
	let el,token

	let tokens = parseText(text) // 解析文本获得tokens

	if (!tokens) return null

	for (let i = 0; i < tokens.length; i++) {
		token = tokens[i]
		el = token.tag ? processToken(token) : document.createTextNode(token.value)
		frag.appendChild(el)
	}

	return makeTextNodeLinkFn.call(this, tokens, frag, node, this.vm)
}

Compile.prototype.compileEvent = function (node, vm, exp, dir) {
	let eventType = dir.indexOf(':') === -1 ? dir : dir.split(':')[1] // on:click,取得click，或者直接为click
	let cb = vm.$methods && vm.$methods[exp]
		
	if (eventType && cb) {
		node.addEventListener(eventType, cb.bind(vm), false)
	}
}

// v-model = "abc", 这个abc是在data里的
Compile.prototype.compileModel = function (node, vm, exp, dir) {
	let that = this
	let val = this.vm[exp]
	
	this.modelUpdater(node, val)
	new Watcher(this.vm, exp, function() {
		that.modelUpdater(node, this.value)
	})

	node.addEventListener('input', function(e) {
		let newVal = e.target.value
		if (val === newVal) return
		that.vm[exp] = newVal
		val = newVal
	})
}

Compile.prototype.updateText = function (node, val) {
	node.textContent = val ? val : ''
}

Compile.prototype.modelUpdater = function (node, val) {
	node.value = val ? val : ''
}

/**
 * 将建立的frag替换原text，并创建watcher
 * @param  {Array} tokens 解析出来的文本对象
 * @param  {Fragment} frag   建立的文档碎片
 * @param  {DOM} node   原text节点
 * @param  {Vue} vm     vm实例
 */
function makeTextNodeLinkFn(tokens, frag, node, vm) {
	let that = this // that指向Compile
	// var fragClone = frag.cloneNode(true)
	let childNodes = toArray(frag.childNodes)
	
	for (let i = 0, l = tokens.length; i < l; i++) {
		let token = tokens[i]
		let exp = token.value
		let des = token.descriptor //记录着存模板的节点，更新时需要这个节点
		
		if (token.tag) {
			let watcher = new Watcher(vm, exp, function () {
				that.updateText(des.node, this.value)
				console.log('更新DOM了' + exp + ' ' + this.value)
			})
			
			console.dir(des.node)

			that.updateText(des.node, watcher.value)
		}
	}
	
	replace(node, frag)
}

export default Compile
