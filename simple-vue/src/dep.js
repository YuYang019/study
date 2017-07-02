/**
 * 依赖容器Dep
 */

let uid = 0

/**
 * 构造函数
 */
function Dep () {
	this.id = uid++
	this.subs = []
}

// 全局的watcher
Dep.target = null

// sub 是一个 watcher
Dep.prototype.addSub = function (sub) {
	this.subs.push(sub)
}

Dep.prototype.depend = function () {
	// 注意Dep.target是一个watcher
	// 将watcher添加进dep
	Dep.target.addDep(this)
}

Dep.prototype.notify = function () {
	this.subs.forEach(sub => {
		sub.update()
	})
}

export default Dep
