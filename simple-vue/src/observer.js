/**
 * 观察对象
 */

import Dep from './dep'
import {
	isObject
} from './util/util'

/**
 * 观察对象构造函数
 * @param {Object} data 数据对象
 */
function Observer (data) {
	this.data = data

	this.walk(data)
}

Observer.prototype.walk = function (data) {
	Object.keys(data).forEach(key => {
		defineReactive(data, key, data[key])
	})
}

export function observe (data, vm) {
	if (!isObject(data)) return

	let ob = new Observer(data)

	return ob
}

function defineReactive (data, key, val) {
	let dep = new Dep()
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

