/**
 * 解析表达式，返回res对象
 * @param  {String} exp 表达式
 * @return {Object} res 
 */
export function parseExp (exp) {
	let res = { exp: exp }
	res.get = makeGetterFn(`scope.${exp}`)

	function makeGetterFn (body) {
		try {
			return new Function('scope', `return ${body};`)
		} catch (e) {
			return function () {}
		}
	}

	return res
}

/**
 * 解析文本，返回tokens
 * @param  {String} text 文本
 * @return {Array} tokens
 */
export function parseText (text) {
	let reg = /\{\{((?:.)+?)\}\}/g
	let tokens = []
	let match, index, lastIndex, value
	let oneTime = true

	while (match = reg.exec(text)) {
		index = match.index // 第一次匹配到的index

		// 如果第一次，且index不为0则说明是类似 asdd{{user.name}} 这样的形式
		// 所以把开头的字符串加入tokens
		if (index !== 0 && oneTime) {
			tokens.push({
				value: text.slice(0, index)
			})
			oneTime = false
		}

		// index是第一次匹配模板{{}}时的index
		// lastindex是下一次匹配到模板的index
		// 如果index > lastindex 说明两个模板之间有普通的文本，所以把该文本输出		
		if (index > lastIndex) {
			tokens.push({
				value: text.slice(lastIndex, index)
			})
		}

		value = match[1] // user.a

		tokens.push({
			tag: true,
			value: value.trim()
		})
		//lastindex应该是index加上模板的长度
		lastIndex = index + match[0].length // 0 + '{{user.a}}'.length
	}

	if (lastIndex < text.length) {
      tokens.push({
        value: text.slice(lastIndex)
      })
    }

	return tokens
}

export function processToken (token) {
	let el

	el = document.createTextNode(' ')

	token.descriptor = {
		type: 'text',
		node: el,
		exp: token.value
	}

	return el
}
