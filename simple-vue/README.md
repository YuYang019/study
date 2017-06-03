# 极简版vue

之前做到了这个题目，但是感觉实现的很烂，所以重新做了一遍，参（chao）考（xi）了vue1.x的源码，重点关注的是双向数据绑定的实现，说说思路吧

重点是Observer, Dep, Watcher, Compile这几个构造函数

Observer： 改造数据对象，使set和get能够被监听，然后我们就能做一些事情了

Dep: 依赖容器，每个数据对应一个Dep容器，它存在于闭包之中，在改造数据的时候被创建，容器里装的是watcher，watcher在数据get的时候被隐式添加进dep。

watcher: 观察者，当数据的set被触发的时候，依次调用该数据dep容器里的watcher的更新函数，这样就能实现视图和数据的更新。

compile: 编译函数，在初始化的时候，遍历dom各节点，对每个有模板或者命令的节点都创建一个watcher，并绑定该节点与watcher的关系，这样更新的时候就能精确的更新某个节点了，但是这个watcher如何添加进Dep依赖容器里呢，答案就是创建watcher的时候，watcher里会获取一次数据的值，触发get，watcher就被隐式添加到Dep里了。

vue源码有很多精妙之处，我都参(chao)考(xi)了，让人大开眼界，比如：

* 依赖的添加，通过一个全局变量Dep.target来添加。隐式添加依赖
* 如何通过路径，如 user.name 获取值，我原来是把这个拆开成user,name,然后通过递归获取，但人家直接用一个匿名函数return scope.user.name 把vm传进去，直接获取vm.user.name。多简单
* compile函数的写法，转换成文档碎片。
* Dep依赖容器存放于闭包之中，竟然还有这种操作，厉害，之前一直不知道如果要每个数据对应一个依赖容器的话，这个容器应该放在哪。

待改进：

- 模版的解析不支持 {{user.name}}11 ，这样解析完后11会消失。
- 批处理dom

至于vue2.x的virtual dom，还得研究研究...