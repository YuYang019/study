/**
 * 观察者
 */

import Batcher from './batcher'
import Dep from './dep'
import { parseExp } from './parse/parse'

let $uid = 0
let batcher = new Batcher()

/**
 * 构造函数
 * @param {Vue}   vm  vue实例
 * @param {String}   exp 表达式
 * @param {Function} cb  更新函数
 */
function Watcher (vm, exp, cb) {
	this.id = ++$uid
	this.cb = cb
	this.vm = vm
	this.exp = exp
	this.deps = []
	this.newDeps = []
	this.depIds = new Set()
	this.newDepIds = new Set()

	// 把exp转换一下，比如user.a 变成一个匿名函数，return scope.user.a
	// 求值的时候，scope = vm, 就能获取 vm.user.a，这样不需要用原来的递归，
	// 而且还完美解决了隐式添加依赖的问题
	let res = parseExp(exp)
	this.getter = res.get

	this.value = this.get() //把自己添加进依赖中
}

Watcher.prototype.update = function () {
	this.run()
}

Watcher.prototype.getId = function () {
	return this.id
}

Watcher.prototype.get = function () {
	this.beforeGet()

	let scope = this.vm
	// 传入scope获取值
	let value = this.getter.call(scope, scope)

	this.afterGet()

	return value
}

Watcher.prototype.run = function () {
	let value = this.get()
	let oldVal = this.value
	if (value !== oldVal) {
		this.value = value
		// 批处理更新
		batcher.push(this)
	}
}

Watcher.prototype.beforeGet = function () {
	Dep.target = this
}

Watcher.prototype.afterGet = function () {
	Dep.target = null

	// 为了让dep.subs里的watcher不重复
	let tmp = this.depIds
	this.depIds = this.newDepIds
	this.newDepIds = tmp
	this.newDepIds.clear()
}

// 传进来的是一个dep，它是当前数据的依赖容器，储存着一个个watcher
Watcher.prototype.addDep = function (dep) {
	let id = dep.id

	// 源码写法，让watcher不重复的核心逻辑
	if (!this.newDepIds.has(id)) {
		this.newDepIds.add(id)
		this.newDeps.push(id)
		// 只有当depIds里没有这个watcher才添加
		if (!this.depIds.has(id)) {
			dep.addSub(this)
		}
	}
}

export default Watcher