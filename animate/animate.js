;
(function(global, doc) {

    // 缓存类，用于储存动画队列
    function Data() {
        this.cache = {}
    }

    Data.prototype = {
        constructor: Data,
        set: function(el, data) {
            this.cache[el] = data
        },
        get: function(el) {
            return this.cache[el] || ''
        }
    }

    var data = new Data()

    function _(elName) {
        return new _.prototype.init(elName)
    }

    _.prototype = {
        constructor: _,
        init: function(elName) {
            this.el = doc.querySelector(elName)
            this.elName = elName

            _.fixPosition(this.el)
            _.initQueue(this.elName)
        },
        animate: function(properties, options) {
            var fn = Animation.bind(this, this.el, this.elName, properties, options)

            _.queue(this.elName, fn)

            return this
        }
    }

    window.data = data

    _.extend = function(obj) {
        if (Object.prototype.toString.call(obj) === '[object Object]') {
            for (var key in obj) {
                _[key] = obj[key]
            }
        }
    }

    _.extend({
        initQueue: function(elName) {
            if (!data.get(elName)) {
                data.set(elName, {
                    queue: [],
                })
            }
        },
        queue: function(elName, fn) {
            var fxqueue = data.get(elName).queue
            if (elName) {
                if (fn) {
                    fxqueue.push(fn)

                    if (fxqueue[0] !== 'inprogress') {
                        _.dequeue(elName)
                    }
                }
            }
        },
        dequeue: function(elName) {
            var fxqueue = data.get(elName).queue,
                fn = fxqueue.shift(),
                startLength = fxqueue.length;

            if (fn === 'inprogress') {
                fn = fxqueue.shift()
                startLength--
            }

            if (fn) {
                fxqueue.unshift('inprogress')

                fn.call(null)
            }

        },
        fixPosition: function(el) {
            var computed = getStyles(el)
            var ret = computed.getPropertyValue('position') || computed['position'];

            if (ret === 'static') {
                el.style.position = 'absolute'
            }
        }
    })

    _.prototype.init.prototype = _.prototype

    ////////////
    //创建动画缓动对象 //
    ////////////
    function Tween(value, prop, animation) {
        this.elem = animation.elem;
        this.prop = prop;
        this.easing = swing; //动画缓动算法
        this.options = animation.options;
        //获取初始值
        this.start = this.now = this.get();
        //动画最终值
        this.end = value;
        //单位
        this.unit = "px"
    }

    function getStyles(elem) {
        return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
    };

    function swing(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    }

    Tween.prototype = {
        //获取元素的当前属性
        get: function() {
            var computed = getStyles(this.elem);
            var ret = computed.getPropertyValue(this.prop) || computed[this.prop];

            if (ret === 'auto' && (this.prop === 'left' || 'top' || 'right' || 'bottom')) {
                ret = this.elem.getBoundingClientRect()[this.prop]
            }

            return parseFloat(ret);
        },
        //运行动画
        run: function(percent) {
            var eased
                //根据缓动算法改变percent
            this.pos = eased = this.easing(percent);
            //获取具体的改变坐标值
            this.now = (this.end - this.start) * eased + this.start;
            //最终改变坐标
            if (this.prop === 'opacity') {
                this.elem.style[this.prop] = this.now
            } else {
                this.elem.style[this.prop] = this.now + this.unit;
            }

            if (this.options.step) {
                this.options.step()
            }

            return this;
        }
    }

    ////////
    //动画类 //
    ////////
    function Animation(elem, elName, properties, options) {
        if (!options) options = {}

        Object.assign(options, {
            duration: 2000,
            complete: function() {
                _.dequeue(elName)
            }
        })

        //动画对象
        var animation = {
            elem: elem,
            elName: elName,
            props: properties,
            originalOptions: options,
            options: options,
            startTime: Animation.fxNow || createFxNow(), //动画开始时间
            tweens: [] //存放每个属性的缓动对象，用于动画
        }

        //生成属性对应的动画算法对象
        for (var k in properties) {
            // tweens保存每一个属性对应的缓动控制对象
            animation.tweens.push(new Tween(properties[k], k, animation))
        }


        //动画状态
        var stopped;

        // 动画的定时器调用包装器
        // 确定当前动画进度百分比、依次改变动画的属性值、判断当前动画进度
        var tick = function() {
            if (stopped) {
                return false;
            }
            //动画时间算法
            var currentTime = Animation.fxNow || createFxNow()
                //运动时间递减
            remaining = Math.max(0, animation.startTime + animation.options.duration - currentTime), // 剩余时间
                temp = remaining / animation.options.duration || 0, // 剩余时间所占百分比
                percent = 1 - temp; // 当前时间所占百分比

            var index = 0,
                length = animation.tweens.length;

            //执行动画改变
            for (; index < length; index++) {
                //percent改变值
                animation.tweens[index].run(percent);
            }

            //是否继续，还是停止
            if (percent <= 1 && length) {
                return remaining;
            } else {
                //停止
                stopped = true
                return false;
            }

        }
        tick.elem = elem;
        tick.anim = animation

        Animation.fx.timer(tick)
    }

    //创建开始时间
    function createFxNow() {
        setTimeout(function() {
            Animation.fxNow = undefined;
        });
        return (Animation.fxNow = Date.now());
    }


    //用于定时器调用
    Animation.timers = []

    Animation.fx = {
        //开始动画队列
        timer: function(timer) {
            Animation.timers.push(timer);

            console.log('push timer')

            if (timer()) {
                if (timer.anim.options.start) timer.anim.options.start()
                    //开始执行动画
                Animation.fx.start();
            } else {
                timers.pop();
            }
        },
        //开始循环
        start: function() {
            if (!Animation.timerId) {
                Animation.timerId = setInterval(Animation.fx.tick, 13);
            }
        },
        //停止循环
        stop: function() {
            clearInterval(Animation.timerId);
            Animation.timerId = null;
        },
        //循环的的检测
        tick: function() {
            var timer,
                i = 0,
                timers = Animation.timers;

            Animation.fxNow = Date.now();

            // 循环遍历timers，依次调用tick函数
            // 注意：timers是全局的，它包含了所有动画的tick函数
            for (; i < timers.length; i++) {
                // 就是tick函数
                timer = timers[i];

                // 注意: 判断!timer()的时候就进行了调用, 且完成就会返回false，完成后!timer()为true
                // 于是通过判断继续执行接下来的语句
                if (!timer() && timers[i] === timer) {
                    // 如果完成了就删除这个动画
                    var curTimer = timers.splice(i--, 1)[0]
                        // 回调通知执行下一个动画
                    curTimer.anim.options.complete()
                        // 触发钩子
                    if (timer.anim.options.end) {
                        timer.anim.options.end()
                    }
                }

            }

            if (!timers.length) {
                Animation.fx.stop();
            }
            Animation.fxNow = undefined;
        }
    }

    global._ = _

})(window, document)

