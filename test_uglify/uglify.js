var input = process.argv;/*获取控制台输入数组（process引用当前进程）*/

/*符合CommonJs规范*/
var writePath = 'min.js',/*默认输出到本目录min.js文件里*/
  fs = require('fs'),
  r1 = /^(.+)$/mg,/*分行*/
  r2 = /\s{2,}/g,/*去空格*/
  r3 = /([^\\])\/\/.*/g,/*去行注释*/
  r4 = /\/\*.*?\*\//g,/*去块注释*/
  str = '';
var run = function(input){
  input.forEach(function(item){
    /*合并对顺序有需求，所以同步读取文件*/
    var data = fs.readFileSync(item, 'utf8'),
      lines = data.match(r1);/*行数组*/
     /*拼成一串*/
    lines.forEach(function(item){
      item = item.replace(r3, function($1, $2){return $2;});
      str = str + item;
    });
  });
  str = str.replace(r2,' ').replace(r4, '');   
  /*异步写入到目标文件*/
  fs.writeFile(writePath, str, {encoding: 'utf8'}, function(err){
    if(err) {throw err};
    console.log('complete........');
  });
};


run(input.slice(2));/*忽略前数组前两个*/