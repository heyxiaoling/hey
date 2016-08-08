// 引入fs文件处理模块
var fs = require("fs");

// 测试用的HTML页文件夹地址和文件名称
//
var content = './content', build = './build', filename = 'index.html';

function readHtml(src1,src2){
    fs.readdir(src1, function(err, files) {
        // files是名称数组，因此
        // 可以使用forEach遍历哈, 此处为ES5 JS一点知识
        // 如果不清楚，也可以使用for循环哈
        files.forEach(function(filename) {
            console.log(filename);
            replaceHtml(src1,src2,filename);
        });
    });
}

function replaceHtml(src1,src2,filename) {
    // 读取HTML页面数据
    // 使用API文档中的fs.readFile(filename, [options], callback)
    fs.readFile(src1 + '/' + filename, {
        // 需要指定编码方式，否则返回原生buffer
        encoding: 'utf8'
    }, function(err, data) {
        // 下面要做的事情就是把
        // <link rel="import" href="header.html">
        // 这段HTML替换成href文件中的内容
        // 可以求助万能的正则
        var dataReplace = data.replace(/<link\srel="import"\shref="(.*)">/gi, function(matchs, m1) {
            // m1就是匹配的路径地址了
            // 然后就可以读文件了
            return fs.readFileSync(src2 + '/' + m1, {
                encoding: 'utf8'
            });
        });

        // 由于我们要把文件放在更上一级目录，因此，一些相对地址要处理下
        // 在本例子中，就比较简单，对../进行替换
        dataReplace = dataReplace.replace(/"\.\.\//g, '"');

        // 于是生成新的HTML文件
        // 文档找一找，发现了fs.writeFile(filename, data, [options], callback)
        fs.writeFile(filename, dataReplace, {
            encoding: 'utf8'
        }, function(err) {
            if (err) throw err;
            console.log(filename + '生成成功！');
        });
    });
};


// 监控文件，变更后重新生成

function watchHtml(src,filename){
    fs.readdir(src, function(err, files) {
        // files是名称数组，因此
        // 可以使用forEach遍历哈, 此处为ES5 JS一点知识
        // 如果不清楚，也可以使用for循环哈
        files.forEach(function(filename) {
            fs.watch(src + '/' + filename, function(event, filename) {
                if (event == 'change') {
                    console.log(content + '/' + filename + '发生了改变，重新生成...');
                    readHtml(build,content);
                }
            });
        });
    });

    
}

watchHtml(content);
readHtml(build,content);

// fs.watch(content + '/' + 'header.html', function(event, filename) {
//     if (event == 'change') {
//         console.log(content + '/' + filename + '发生了改变，重新生成...');
//         readHtml(build,content);
//     }
// });

// fs.watch(content + '/' + 'footer.html', function(event, filename) {
//     if (event == 'change') {
//         console.log(content + '/' + filename + '发生了改变，重新生成...');
//         readHtml(build,content);
//     }
// });

// 默认先执行一次

