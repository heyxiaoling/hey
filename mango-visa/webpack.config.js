var path = require('path');
var webpack = require('webpack');
var HWP = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH,'lib');
var APP_IN = path.resolve(APP_PATH,'app.js');

var BUILD_PATH = path.resolve(ROOT_PATH,'build');



var commonsPlugins = new webpack.optimize.CommonsChunkPlugin('module.js?v=[hash:8]');

module.exports = {
	entry: {
		app: [APP_IN]
	},
	output: {
		path: BUILD_PATH,
    	filename: '[name].js?v=[chunkhash:8]'
	},
	devtool: 'inline-source-map',
	debug: true,
	resolve: {
		alias: {
      		'redux-devtools': path.resolve(__dirname, '..', '..', 'lib'),
			'react': path.resolve(ROOT_PATH, 'node_modules', 'react')
		}
	},
	resolveLoader: {
	  'fallback': path.resolve(__dirname, 'node_modules')
	},
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true
	},
	module: {
		loaders: [
			{
                test: /\.css$/,
                //配置css的抽取器、加载器。'-loader'可以省去
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.less$/,
                //配置less的抽取器、加载器。
                loader: ExtractTextPlugin.extract('css!less')
            },
			{
				test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, 
				loader: 'url-loader?limit=8192'
			},
			{
				test: /\.js$/,
				loader: 'babel',
                query: {
                    presets: ['es2015-loose', 'stage-0', 'react']
                },
				exclude: /node_modules/,
				include: path.join(__dirname, 'lib')
			},
			{
				test: /\.js$/,
				loader: 'babel',
                query: {
                    presets: ['es2015-loose', 'stage-0', 'react']
                },
				include: path.join(__dirname, '..', '..', 'lib')
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		commonsPlugins,
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		})
	]
};
