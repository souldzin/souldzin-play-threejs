var gulp = require('gulp');
var gulpif = require('gulp-if');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');

module.exports = function(opt){
    var isWatch = opt.watch;
    var sourcePrefix = opt.source + '**/';
    var destDir = opt.dest;
    var sources = [sourcePrefix + '*', '!' + sourcePrefix + 'app.js'];

    var stream = gulp.src(sources);

    if(isWatch) {
        stream = stream.pipe(watch(sources));
    }

    return stream.pipe(gulp.dest(destDir));
};
