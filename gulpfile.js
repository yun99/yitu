var fs = require("fs");
var packageData = require('./package.json');
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require("gulp-rename"),
    // md5 = require('gulp-md5-plus'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
var bs = require('browser-sync').create();
var reload = bs.reload;



// 编译Sass
gulp.task('sass', function() {
    gulp.src('app/sass/*.sass')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(gulp.dest('app/css/'))
        .pipe(rename({extname:'.css'}))
        .on('end', function(){

        });
});

// 检查js
// gulp.task('lint', function() {
//   return gulp.src('src/js/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(notify({ message: 'lint task ok' }));
// });

// 合并、压缩js文件
gulp.task('js', function() {
  gulp.src('www/js/source/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('www/js/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({
            mangle: false,
            compress: true,
            preserveComments: 'none'
        }))
    .pipe(gulp.dest('www/js/').on("end", function(){
      console.log("js is ok")
    }));
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
// gulp.task('md5_dev_js', ['build_dev_js'], function (done) {
//     gulp.src('dev/js/*.js')
//         .pipe(md5(10, 'dev/*.html'))
//         .pipe(gulp.dest('dev/js'))
//         .on('end', done);
// });


//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
// gulp.task('md5_dev_css', ['copy_dev'], function (done) {
//     gulp.src('dev/css/*.css')
//         .pipe(md5(10, 'dev/*.html'))
//         .pipe(gulp.dest('dev/css'))
//         .on('end', done);
// });



// // 拷贝配置文件
// gulp.task('add_dev_config', function (done) {
//     gulp.src("config/devConfig.js")
//         .pipe(rename("config/config.js"))
//         .pipe(gulp.dest(''))
//         .on('end', done);
// });


gulp.task('serve', function() {
  bs.init({
    server:{
        baseDir: './app',
        middleware: function (req, res, next) {
            // if (mocks[req.url]) {
            //     resJson(mocks[req.url],res)
            //     // mocks[req.url](req, res);
            // }
            next();
        }
    },

    index:'index.html',
    port:3015,
    ui: false
  });
  // 页面重载

  // gulp.watch(['./**/*.html', './www/css/**/*.css', './www/js/*.js']).on('change', reload);
});

gulp.task('watch', function(done) {
  gulp.watch(['./**/*.html', './app/css/**/*.css', './app/js/*.js']).on('change', reload);
    gulp.watch('./app/**/*.sass', ['sass']);
    // gulp.watch('./app/js/source/*.js', ['js']);
});

gulp.task('default', ['sass', 'watch', 'serve']);
// gulp.task('default', ['sass', 'js', 'serve', 'watch']);


function resJson(url,res){
    var data = fs.readFileSync(__dirname+url);
    data = JSON.stringify(JSON.parse(data.toString()));
    res.setHeader("Content-Type", "application/json");
    res.end(data);
}
