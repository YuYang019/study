import Vue from '../src/index'

var app = new Vue({
	el: '#app',
	data: {
		count: 0,
		msg: '',
		user: {
			name: 'maoyuyang'
		}
	},
	methods: {
		add: function () {
			this.count++
		}
	}
})

window.app = app

