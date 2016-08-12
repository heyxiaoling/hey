var webpack = require('webpack');
var path = require('path');
var ETP = require('extract-text-webpack-plugin');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');


var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH,'js');
var APP_IN = path.resolve(APP_PATH,'draw.js');
var BUILD_PATH = path.resolve(ROOT_PATH,'build');

module.exports = {
    devtool: 'inline-source-map',
    //页面入口文件配置
    entry: {
        app : [APP_IN]
    },
    //入口文件输出配置
    output: {
        path: BUILD_PATH,
        filename: '[name].js?v=[chunkhash:8]'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],   
    },
    //插件项
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.HotModuleReplacementPlugin(),
        commonsPlugin,
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
    ]
};