let webpack = require('webpack'),
    path = require('path'),
    ETP = require('extract-text-webpack-plugin');

let commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');


let root_path = path.resolve(__dirname),
    draw_path = path.resolve(root_path,'./js/draw.js'),
    coupon_path = path.resolve(root_path,'./js/coupon.js'),

    build_path = path.resolve(root_path,'./build');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        draw: [draw_path],
        coupon: [coupon_path] 
    },
    output: {
        path: build_path,
        filename: '[name].js?v=[chunkhash:8]'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }, 
            {test: /\.js$/,loader: 'babel',query: {presets: ['es2015','stage-0']}},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss'],   
    },
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