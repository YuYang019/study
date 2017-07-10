/**
 * 观察对象
 */

import Dep from './dep'
import {
	isObject,
	isArray,
	hasProto
} from './util/util'

function def (obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enmerable: !!enumerable,
		writable: true,
		configurable: true
	})
}

function indexOf (arr, obj) {
	let i = arr.length
	while (i--) {
		if (arr[i] === obj) return i
	}
	return -1
}

// 数组构造函数的原型，里面包含数组的原生方法，是一个对象
const arrayProto = Array.prototype 

// 创建一个拦截对象，这个对象的原型(__proto__)为arrayProto，用途是拦截数组的push等方法
// 数组调用push等方法改变的话，调用的就是我们定义的方法，而不是原生方法，这样就能实现监听数组的变化
const arrayMethods = Object.create(arrayProto) 


// 给拦截对象添加自定义的方法
;[
	'push',
	'pop',
	'shift',
	'unshift',
	'splice',
	'sort',
	'reverse'
]
.forEach(function (method) {
	let original = arrayProto[method]
	// 给拦截对象添加我们自定义的push等自定义方法属性
	def(arrayMethods, method, function mutator () {
		let  i = arguments.length
		let args = new Array(i)
		while (i--) {
			args[i] = arguments[i]
		}
		let result = original.apply(this, args)
		let ob = this.__ob__
		let inserted
		switch (method) {
			case 'push':
				inserted = args
				break
			case 'unshift':
				inserted = args
				break
			case 'splice':
				inserted = args.splice(2)
				break
		}
		if (inserted) ob.observeArray(inserted)

		console.log(ob)
		ob.dep.notify()
		return result
	})
})

// def(
// 	arrayProto,
// 	'$set',
// 	function $set (index, val) {
// 		if (index >= this.length) {
// 			this.length = Number(index) + 1
// 		}
// 		return this.splice(index, 1, val)[0]
// 	}
// )

const arrayKeys = Object.getOwnPropertyNames(arrayMethods) // 获取键值

/**
 * 观察对象构造函数
 * @param {Object} data 数据对象
 */
function Observer (data) {
	this.data = data
	this.dep = new Dep()
	def(data, '__ob__', this)
	if (isArray(data)) {
		let augment = hasProto
		? protoAugment // 直接改变 value.__proto__ 
		: copyAugment // 直接改变本身方法

		// 替换数组的__proto__，拦截原生push等方法，用我们定义的来代替从而能够监听数组变化
		
		// 当__proto__不可访问时，就循环把我们定义的push等方法一个个加进去
		// 可访问时，就直接把我们构造好的arrayMethods赋值给__proto__，这样数组调用相关方法时
		// 会首先顺着__proto__找到我们定义好的这些方法
		augment(data, arrayMethods, arrayKeys)

		// 遍历数组
		this.observeArray(data)
	} else {
		this.walk(data)
	}	
}

Observer.prototype.walk = function (data) {
	Object.keys(data).forEach(key => {
		defineReactive(data, key, data[key])
	})
}

Observer.prototype.observeArray = function (items) {
	for (var i = 0, l = items.length; i < l; i++) {
		observe(items[i])
	}
}

export function observe (data, vm) {
	let ob

	if (!isObject(data)) return

	ob = new Observer(data)

	return ob
}

function defineReactive (data, key, val) {
	let dep = new Dep()
	// 递归遍历，如果val是一个对象或数组，则new Observer(val)，返回这个Observer
	// 在new的时候，这个Observer会被加进该对象或数组，为什要加进去，就是为了给数组的依赖容器找个地方放，不然数组的watcher没地方存，对象加不加都无所谓。
	// 为什么要返回这个？作用为了得到数组的依赖容器，然后进行数组依赖的添加
	// 在创建watcher的时候，会触发get，隐式添加依赖，对数组来说，有了这个childObj，就可以往这里面的容器添加watcher
	// 而这个childObj因为之前被已添加进该数组了，所以更新的时候，就可以直接取得这个容器进行更新
	// 如果仅是对象的话，返不返回Observer都无所谓，因为对象的依赖容器是这个闭包里的dep
	let childObj = observe(val)
	Object.defineProperty(data, key, {
		enumerable: true,
		configrable: true,
		get () {
			if (Dep.target) {
				// 不能直接这样写，因为我们还需要判断依赖是否重复添加
				// 所以要做进一步处理
				// dep.addSub(Dep.target)
				dep.depend()
				// 数组添加依赖，虽然数组也有一个dep存于闭包，依赖也会被添加进这个dep，但是我们更新的时候不用它
				// 原因是，数组的变化我们不使用defineProperty监听，这个dep获取不到。而用的是数组自身的__ob__，也就是这个childObj
				// 同样，对象也会有__ob__属性，依赖也会被添加进去，但是我们不用它，更新时用的是闭包中的dep
				// 为什么不让只有数组有这个__ob__属性，对象的__ob__不知道还有什么其他用途？可能我没发现
				if (childObj) {
					childObj.dep.depend()
				}
				if (isArray(val)) {
					// 给所有子数组添加当前的watcher
					// 父数组有这个watcher，子数组也有这个watcher，这是为了保证父子数组的watcher一致，为什么要这样呢？
					// 试想，如果不一致，子数组没有添加依赖，那么子数组改变的话，视图就无法更新了
					// 但是有个缺点，至多支持二维数组，如果是三层数组嵌套的话，第三层数组的__ob__无法添加watcher
					// 源码也有这个问题
					// 估计这是作者在代码复杂度、性能和适用性之间的权衡
					for (let i = 0, l = val.length, e; i < l; i++) {
						e = val[i]
						e && e.__ob__ && e.__ob__.dep.depend()
					}
				}
			}
			return val
		},
		set (newVal) {
			if (val === newVal) return
			val = newVal
			childObj = observe(newVal)
			dep.notify()
		}
	})
}

function copyAugment (target, src, keys) {
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i]
		def(target, key, src[key])
	}
}

function protoAugment (target, src) {
	target.__proto__ = src
}
