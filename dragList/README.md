# 列表拖拽

## usage

    new DragList(document.querySelector('.items'), {
		dragStart: function(el) {

		},
		dragEnd: function(el) {

		}
    })

## [Demo](https://maoyuyang.github.io/study/dragList/index.html)

感觉还是挺炫酷的，做了一些小优化，本来想用什么diff算法的，后来发现没必要。简单的插入就能更新列表
拖拽特效参考自[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)，也是因为之前看到这个拖拽挺好看的，所以想着能不能自己实现一下。

具体原理参看源码