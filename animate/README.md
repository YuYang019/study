## 一个简单的动画框架

参考了jquery动画的实现，支持链式调用，很多属性值未做处理，比如css3,颜色等，主要目的是为了学习队列的操作和动画的实现

## example


	_('#a').animate({
			left: 600,
			top: 500,
		},{
			duration: 2000,
			start: function() { console.log('start') },
			step: function() { console.log('step') },
			end: function() { console.log('step') },
		}).animate({
			top: 0,
			opacity: 0,
			left: 0
		},{
			duration: 3000
		})


## [demo](https://maoyuyang.github.io/study/animate/index.html)

## 总结

关于队列的操作就是queue和dequeue，这不同于数组的push和pop，dequeue的时候取出的函数会立即调用它，而queue加入的时候也会dequeue一次，目的是为了能够实现自动启动动画，而不需要额外的函数例如 start() 这样再声明，缺点就在于，队列里只能是函数

缓存了类Data的意义在于，能够为每个节点提供一个专属于该节点的动画队列，防止冲突。一个节点如果链式调用多个动画，那么这些动画都会被添加进该节点的动画队列，随后被依次执行

Animation函数是动画的核心，需要注意的是它不是一个构造函数，它不关心外部如何调用它，只需要传给它节点，属性等参数，它就会按照这些参数运动。

所以，队列机制和动画函数是完全解耦的，队列只负责动画与动画之间的调度工作，而动画函数只关心单个动画的运动，我觉得这是实现链式动画的核心思想

Tween就是单个动画里，每个属性值的缓动对象，比如一个动画改变了top和left值，那么就有两个Tween实例分别代表top属性和left属性，每次改变会调用每个Tween实例的run方法改变单个属性值。其实这部分也可以写在Animation函数里，只是jquery更进一步的解耦了。

关于动画钩子的实现，水平有限实现的不够好，最好的方式其实应该是如jquery中，利用jquery的deferred对象把动画函数转成一个类似promise对象的东西，然后注册done, progress, fail等事件，这种方式感觉是很优雅的。


