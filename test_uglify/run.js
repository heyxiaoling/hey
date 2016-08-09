var a = require('./compress.js');/*加载compress模块 ‘./’表示相同目录下查找本地文件*/

var input = process.argv;/*获取控制台输入数组（process引用当前进程）*/

a.run(input.slice(2));/*忽略前数组前两个*/