import Vue from '../src/index'

var app = new Vue({
	el: '#app',
	data: {
		count: 0,
		msg: '',
		user: {
			name: 'maoyuyang'
		},
		array: [1,2,3]
	},
	methods: {
		add: function () {
			this.count++
		}
	}
})

window.app = app

