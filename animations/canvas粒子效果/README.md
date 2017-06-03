# canvas粒子特效

## 预览[demo](http://htmlpreview.github.io/?https://github.com/maoyuyang/study/blob/master/animations/canvas%E7%B2%92%E5%AD%90%E6%95%88%E6%9E%9C/index.html)

实现思路：

首先在画布绘制一个个的圆点 ，确定这些圆点的初始横纵坐标和每次移动的距离，每帧遍历这些圆点，改变横纵坐标然后重新绘制，绘制线的时候，距离小于某值时连线，否则不连。

至于鼠标移动的效果，鼠标移动的时候，有一个专门用于鼠标事件的圆点，它的横纵坐标等于鼠标的位置，绘制时直接绘制在鼠标所在处，然后绘制的时候判断是否连线就行了