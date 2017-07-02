//复制插件，将example文件夹里的index.html复制到dist目录下
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	watch: true,
	entry: {
		//index: ['./src/index.js'],
		example: ['./example/index.js']
	},
	output: {
		path: __dirname + '/dist',
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					'babel-loader',
					'eslint-loader'
				]
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{from: './example/index.html'}
		], {})
	]
}