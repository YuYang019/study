/**
 * 2017/7/2
 * 极简版Vue，主要学习双向数据绑定的实现
 */

import { observe } from './observer'
import Compile from './compile'

function Vue (options) {
    this._init(options)
}

Vue.prototype._init = function (options) {
	this.$el = document.querySelector(options.el)
	this.$data = options.data
	this.$methods = options.methods

	this.proxy() //把 this.$data.xx 代理到 this.xx 上

	observe(this.$data)
	new Compile(this.$el, this)

	//所有事情处理好之后执行mounted函数
	if (options.mounted) options.mounted.call(this) 
}

Vue.prototype.proxy = function () {
	let that = this
	Object.keys(this.$data).forEach(key => {
		that.proxyKeys(key)
	})
}

Vue.prototype.proxyKeys =  function(key) {
	let that = this
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
}

export default Vue
