var gulp = require('gulp'),
    clean = require('gulp-clean'),
    connect =  require('gulp-connect'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    uglify = require("gulp-uglify"),
    imagemin = require('gulp-imagemin'),
    base64 = require('gulp-base64'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require("gulp-concat");


gulp.task('connect',function(){
    return  connect.server({
                root:'./',
                livereload:true
            });
});

//清空目标文件夹
gulp.task('clean',function(){
    //read参数为false表示不读取文件的内容
    return  gulp.src(['build'],{read:false})
                .pipe(clean());
});

//刷新页面
gulp.task('reload',function(){
    // gulp.src(['**/*.html','!node_modules','!node_modules/**/*','!build','!build/**/*'])
    // gulp.src(['view/*.html','index.html'])
    return  gulp.src(['**/*.*','!node_modules/**/*','!build/**/*'])
                .pipe(connect.reload());
});

//压缩图片，并添加版本
gulp.task('img',function(){
    return  gulp.src('img/**/*')
                .pipe(imagemin())
                .pipe(rev())
                .pipe(gulp.dest('build/rev/img'))
                .pipe(rev.manifest())
                .pipe(gulp.dest('build/rev/img'));
});


//检查css，并添加版本
gulp.task('css',function(){
    return  gulp.src('css/*.css')
                .pipe(
                    autoprefixer({
                        browsers: ['last 2 versions', 'Android >= 4.0'],
                        cascade: true, //是否美化属性值 默认：true 像这样：
                                        //-webkit-transform: rotate(45deg);
                                        //transform: rotate(45deg);
                        remove:true //是否去掉不必要的前缀 默认：true 
                    })
                )
                .pipe(
                    base64({
                        baseDir: '',
                        extensions: ['png'],
                        maxImageSize: 20 * 1024, // bytes
                        debug: false
                    })
                )
                .pipe(rev())
                .pipe(gulp.dest('build/rev/css'))
                .pipe(rev.manifest())
                .pipe(gulp.dest('build/rev/css'));
});


//压缩js，并添加版本
gulp.task('js',['img'],function(){
    return  gulp.src('js/*.js')
                .pipe(uglify())
                .pipe(rev())
                .pipe(gulp.dest('build/rev/js'))
                .pipe(rev.manifest())
                .pipe(gulp.dest('build/rev/js'));
});


/*
 * 收集图片到CSS
 */
gulp.task('revcss',['img','css'], function() {
    return  gulp.src(['build/rev/img/*.json', 'build/rev/css/*.css'])
                .pipe(revCollector())
                .pipe(gulp.dest('build/css'));
});

/*
 * 收集图片到js
 */
gulp.task('revjs',['img','css','js'], function() {
    return  gulp.src(['build/rev/img/*.json', 'build/rev/js/*.js'])
                .pipe(revCollector())
                .pipe(gulp.dest('build/js'));
});


/*
 * rev html
 */
gulp.task('revhtml',['img','css','js'],function() {
    return  gulp.src(['build/rev/**/*.json','{view,}/*.html'])  
                .pipe(
                    revCollector({
                        replaceReved: true
                    })
                ) 
                .pipe(gulp.dest('build')); 
});


//移动字体到目标文件夹
gulp.task('movefont',function(){
    return  gulp.src('font/**/*')
                .pipe(gulp.dest('build/font'));
});


/*
 * 移动IMG文件到目标文件夹
 */
gulp.task('moveimg',['img'], function() {
    return  gulp.src(['build/rev/img/**/*', '!build/rev/img/*.json'])
                .pipe(gulp.dest('build/img'));
});



//合并js  
gulp.task('concat',function(){
    return  gulp.src(['js/a.js','js/b.js'])  
                .pipe(concat('all.js'))  
                .pipe(gulp.dest('build/js'));
});


gulp.task('watch',function(){
    gulp.watch(['**/*.*','!node_modules/**/*','!build/**/*'],['reload']);
});


gulp.task('default', ['clean'], function(){
    gulp.start('img','css','js','movefont','moveimg','revcss','revjs','revhtml','connect','watch');
});
