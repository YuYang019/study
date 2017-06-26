/**
 * 简单版的Vue，主要是学习双向绑定的实现
 * 2017.5.28
 */

/**
 * 批处理构造函数
 */
function Batcher() {
	this.reset()
}

Batcher.prototype.reset = function() {
	this.has = {}
	this.queue = []
	this.waiting = false
}

//job {watcher}
Batcher.prototype.push = function (job) {
	var that = this
	if (!this.has[job.id]) {
		this.queue.push(job)
		this.has[job.id] = job
		if (!this.waiting) {
			this.waiting = true
			//等待主线程空了之后才执行
			setTimeout(function() {
				that.flush()
			},0)
		}
	}
}

Batcher.prototype.flush = function () {
	this.queue.forEach(function(job){
		job.cb.call(job)
	})
	this.reset()
}

function Observer(data) {
	this.data = data
	
	this.walk(data)
}

Observer.prototype = {
	constructor: Observer,
	walk: function(data) {
		var that = this
		Object.keys(data).forEach(function(key) {
			that.defineReactive(data, key, data[key])
		})
	},
	defineReactive: function(data, key, val) {
		var dep = new Dep()
		var childObj = observe(val)
		Object.defineProperty(data, key, {
			enumerable: true,
			configrable: true,
			get: function() {
				if (Dep.target) {
					//不能直接这样写，因为我们还需要判断依赖是否重复添加
					//所以要做进一步处理
					//dep.addSub(Dep.target)
					dep.depend()
				}
				return val
			},
			set: function(newVal) {
				if (val === newVal) return
				val = newVal

				childObj = observe(newVal)
				//console.log(dep)
				dep.notify()
			}
		})
	}
}

function observe(data, vm) {
	if(!data || typeof data !== 'object') return

	return new Observer(data)
}

var uid = 0

function Dep () {
	this.id = uid++
	this.subs = []
}

Dep.target = null

Dep.prototype = {
	constructor: Dep,
	addSub: function(sub) {
		this.subs.push(sub)
	},
	depend: function() {
		//注意Dep.target是一个watcher
		Dep.target.addDep(this)
	},
	notify: function() {
		//subs里存的是一个一个的watcher
		this.subs.forEach(function(sub) {
			sub.update()
		})
	}
}

var $uid = 0

var batcher = new Batcher()

function Watcher(vm, exp, cb) {
	this.id = ++$uid
	this.cb = cb
	this.vm = vm
	this.exp = exp
	this.deps = [];
    this.newDeps = [];
    this.depIds = new Set(); //原生Set对象，值的集合
    this.newDepIds = new Set();
	
	//把exp转换一下，比如user.a 变成一个匿名函数，return scope.user.a
	//求值的时候，scope = vm, 就能获取 vm.user.a，这样不需要用原来的递归，
	//而且还完美解决了隐式添加依赖的问题
	var res = this.parseExp(exp)
	this.getter = res.get
	
	this.value = this.get() //将自己添加到依赖中
}

Watcher.prototype = {
	constructor: Watcher,
	update: function() {
		this.run()
	},
	getId: function() {
		return this.id
	},
	get: function() {
		this.beforeGet()
		
		var scope = this.vm
		//核心重点
		var value = this.getter.call(scope, scope)
		
		this.afterGet()
		
		return value
	},
	run: function() {
		var value = this.get()
		var oldVal = this.value
		if (value !== oldVal) {
			this.value = value
			batcher.push(this)
			//this.cb.call(this.vm, value)
		}
	},
	beforeGet: function() {
		Dep.target = this
	},
	afterGet: function() {
		Dep.target = null

		//让dep.subs里的watcher不重复的核心
		var tmp = this.depIds
		this.depIds = this.newDepIds
		this.newDepIds = tmp
		this.newDepIds.clear()

		// tmp = this.deps
		// this.deps = this.newDeps
		// this.newDeps = tmp
		// this.newDeps.length = 0
	},
	// 传进来的是一个dep,它是当前数据的依赖管理
	addDep: function(dep) {
		var id = dep.id
		//console.log(id)
		//源码写法，让dep.subs里的watcher不重复的核心逻辑
		if (!this.newDepIds.has(id)) {
			this.newDepIds.add(id)
			this.newDeps.push(id)
			if (!this.depIds.has(id)) {
				dep.addSub(this)
			}
		} 			
	},
	parseExp: function(exp) {
		var res = { exp: exp }
		res.get = this.makeGetterFn('scope.' + exp)
		return res
	},
	makeGetterFn: function(body) {
		try {
			//返回一个匿名函数，参数为scope, return scope.body
			return new Function('scope', 'return ' + body + ';')
		} catch (e) {
			console.log(e)
			return function() {}
		}
	}
}

function Compile (el, vm) {
	this.vm = vm
	this.el = el
	this.fragment = null

	this._init()
}

Compile.prototype = {
	constructor: Compile,
	_init: function() {
		if (this.el) {
			this.fragment = this.nodeToFragment(this.el)
			this.compileElement(this.fragment)
			this.el.appendChild(this.fragment)
		} else {
			console.log('dom元素不存在')
		}
	},
	nodeToFragment: function(el) {
		var fragment = document.createDocumentFragment()
		var child = el.firstChild
		while (child) {
			fragment.appendChild(child) //注意append之后，el里的原节点会消失
			child = el.firstChild
		}
		return fragment
	},
	compileElement: function(el) {
		var child = el.childNodes;
		var that = this;
		//[].slice 建立副本
		[].slice.call(child).forEach(function(node) {
			var reg = /\{\{(.*)\}\}/
			var text = node.textContent

			if (that.isElementNode(node)) {
				that.compile(node)
			} else if (that.isTextNode(node) && reg.test(text)) {
				//console.log(reg.exec(text))
				that.compileText(node, text)
			}

			if (node.childNodes && node.childNodes.length) {
				that.compileElement(node)
			}
		})
	},
	compile: function(node) {
		var attrs = node.attributes
		var that = this
		Array.prototype.forEach.call(attrs, function(attr) {
			var attrName = attr.name
			if (that.isDirective(attrName)) {
				var exp = attr.value //v-on:click = "abc",取得methods函数名abc
				var dir = that.getDir(attrName)
				if (that.isEventDirective(dir)) {
					that.compileEvent(node, that.vm, exp, dir)
				} else {
					//v-model
					that.compileModel(node, that.vm, exp, dir)
				}
				node.removeAttribute(attrName)
			}
		})
	},
	compileText: function(node, text) {
		var that = this
		var frag = document.createDocumentFragment()		
		var el, token
		
		var tokens = parseText(text) //解析文本获得tokens
		
		if (!tokens) return null

		for (var i = 0, l = tokens.length; i < l; i++) {
			token = tokens[i]
			el = token.tag ? processToken(token) : document.createTextNode(token.value)
			frag.appendChild(el)
		}

		return makeTextNodeLinkFn.call(this, tokens, frag, node, this.vm)
		
	},
	compileEvent: function(node, vm, exp, dir) {
		var eventType = dir.indexOf(':') === -1 ? dir : dir.split(':')[1] // on:click,取得click，或者直接为click
		var cb = vm.$methods && vm.$methods[exp]
		//console.log(cb)
		if(eventType && cb) {
			//console.log('bind')
			node.addEventListener(eventType, cb.bind(vm), false)
		}

	},
	//v-model = "abc", 这个abc是在data里的
	compileModel: function (node, vm, exp, dir) {
		var that = this
		var val = this.vm[exp]
		this.modelUpdater(node, val)
		new Watcher(this.vm, exp, function(value) {
			that.modelUpdater(node, value)
		})

		node.addEventListener('input', function(e) {
			var newVal = e.target.value
			if (val === newVal) return
			that.vm[exp] = newVal
			val = newVal
		})
	},
	updateText: function(node, val) {
		node.textContent = typeof val == 'undefined' ? '' : val
	},
	modelUpdater: function(node, val, oldVal) {
		node.value = typeof val == 'undefined' ? '' : val
	},
	isElementNode: function(node) {
		return node.nodeType === 1
	},
	isTextNode: function(node) {
		return node.nodeType === 3
	},
	isDirective: function(attr) {
		return attr.indexOf('v-') === 0 || attr.indexOf('@') === 0
	},
	isEventDirective: function(dir) {
		return dir.indexOf('on:') === 0 || dir === 'click'
	},
	// v-on:click , @click , v-model , 三种情况， 返回 v- 之后的或者 click
	getDir: function(attrName) {
		return attrName.indexOf('@') === 0 ? attrName.substring(1) : attrName.substring(2)
	}
}

function Vue(options) {
	this._init(options)
}

Vue.prototype = {
	constructor: Vue,
	_init: function(options) {
		this.$el = document.querySelector(options.el)
		this.$data = options.data
		this.$methods = options.methods

		this.proxy() //把 this.$data.xx 代理到 this.xx 上

		observe(this.$data)
		new Compile(this.$el, this)

		//所有事情处理好之后执行mounted函数
		if (options.mounted) options.mounted.call(this) 
	},
	proxy: function() {
		var that = this
		Object.keys(this.$data).forEach(function(key) {
			that.proxyKeys(key)
		})
	},
	proxyKeys: function(key) {
		var that = this
		Object.defineProperty(this, key, {
			enumerable: true,
			configrable: true,
			get: function proxyGetter() {
				return that.$data[key]
			},
			set: function proxySetter(newVal) {
				that.$data[key] = newVal
			}
		})
	},
	// exp: 形如a.b.c
	getVal: function(exp) {
		var keys = exp.split('.')
		var data = this.$data

		keys.forEach(function(key) {
			data = data[key]
		})

		return data
	}
}


//解析文本，返回obj
function parseText (text) {
	// ((?:.)+?)是核心
	// +?的意思是匹配一次或多次，但是尽可能少匹配
	// (?:  )是一个捕获组，和（）作用差不多，但是和（）相比，不捕获匹配的文本
	// 例如，var data = 'windows 98 is ok';
	//data.match(/windows (?=\d+)/);  // ["windows "]
	//data.match(/windows (?:\d+)/);  // ["windows 98"]
	//data.match(/windows (\d+)/);    // ["windows 98", "98"]
	//(?:.)就是匹配任意字符
	var reg = /\{\{((?:.)+?)\}\}/g
	var tokens = []
	var match,index,lastIndex,value

	while (match = reg.exec(text)) {
		index = match.index; //开始是0

		//index是第一次匹配模板{{}}时的index
		//lastindex是下一次匹配到模板的index
		//如果index > lastindex 说明两个模板之间有普通的文本，所以把该文本输出		
		if (index > lastIndex) {
			tokens.push({
				value: text.slice(lastIndex, index)
			})
		}

		value = match[1] // user.a

		tokens.push({
			tag: true,
			value: value.trim()
		})
		//lastindex应该是index加上模板的长度
		lastIndex = index + match[0].length // 0 + '{{user.a}}'.length
	}

	return tokens
}

/**
 * 将建立的frag替换原text，并创建watcher
 * @param  {[type]} tokens 解析出来的文本对象
 * @param  {[type]} frag   建立的文档碎片
 * @param  {[type]} node   原text节点
 * @param  {[type]} vm     vm实例
 */
function makeTextNodeLinkFn(tokens, frag, node, vm) {
	var that = this
	//var fragClone = frag.cloneNode(true)
	var childNodes = toArray(frag.childNodes)
	var token,exp,des
	for (var i = 0, l = tokens.length; i < l; i++) {
		token = tokens[i]
		exp = token.value
		des = token.descriptor //记录着存模板的节点，更新时需要这个节点
		if (token.tag) {
			//闭包保存每次循环的节点
			var watcher = new Watcher(vm, exp, (function(node,exp){
				return function () {
					that.updateText(node, this.value)
					console.log('更新DOM了' + exp + ' ' + this.value)
				}
			})(des.node,exp))

			console.log(des.node)
			
			this.updateText(des.node, watcher.value)
		}
	}
	replace(node, frag)
}

function processToken(token) {
	var el

	el = document.createTextNode(' ')
	
	token.descriptor = {
		type: 'text',
		node: el,
		exp: token.value
	}

	return el
}

function toArray(arrayLike) {
	var i = arrayLike.length
	var arr = new Array(i)

	while (i--) {
		arr[i] = arrayLike[i]
	}

	return arr
}

function replace(oldnode, newnode) {
	var parent = oldnode.parentNode

	if (parent) {
		parent.replaceChild(newnode, oldnode)
	}
}
