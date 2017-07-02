/**
 * 批处理类构造函数
 */

function Batcher () {
	this.reset()
}

Batcher.prototype.reset = function () {
	this.has = {}
	this.queue = []
	this.waiting = false
}

/**
 * 推入队列
 * @param  {Watcher} job 
 */
Batcher.prototype.push = function (job) {
	let that = this
	if (!this.has[job.id]) {
		this.queue.push(job)
		this.has[job.id] = job
		if (!this.waiting) {
			this.waiting = true
			// 等待主线程空了再执行
			setTimeout(function () {
				that.flush()
			}, 0)
		}
	}
}

/**
 * 冲洗函数，依次调用队列里watcher的更新函数
 */
Batcher.prototype.flush = function () {
	this.queue.forEach(job => {
		job.cb.call(job)
	})
	this.reset()
}

export default Batcher
