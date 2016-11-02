# 芒果移动端
## 目录结构
- mango-mobile
    - src                #代码开发目录
        - skin           #样式目录
            + page		 #存放页面单独使用的样式
            + common	 #公共样式
            + img		 #图片目录
            + font		 #字体目录，存放字体图标等
        - js             #JS脚本
            + page		 #页面对应js存放目录
            + lib		 #公共js库
        - page           #HTML模板
	        + template	 #公共HTML模板
    - dist               #webpack编译打包输出目录，自动生成
        + skin
        + js
    + node_modules       #所使用的nodejs模块
    package.json         #项目配置  
    webpack.config.js    #webpack配置  
	webpack.config.prod.js #生产环境打包配置  
    README.md            #项目说明

## 使用命令
1. 安装node依赖包
> npm install

2. 启动服务命令
> npm start

3. 打包命令
> webpack

4. 打包生产命令
> webpack --config webpack.config.prod.js --colors --profile --display-modules -p
