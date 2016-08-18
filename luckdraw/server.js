let webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config.js');


for(let i in config.entry){
    config.entry[i].unshift("webpack-dev-server/client?http://0.0.0.0:4008/", "webpack/hot/dev-server")
}

new WebpackDevServer(webpack(config), {
    hot: true,
    noInfo: false,
    historyApiFallback: true,
    stats: {
        colors: true
    }
}).listen(4008, '0.0.0.0', function(err) {
    if (err) {
        console.log(err);
    }
    console.log('系统启动，监听4008端口中...');
});