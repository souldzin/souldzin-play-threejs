var gulp = require('gulp');
var path = require('path');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var watchify = require('watchify');

function handleError(err) {
    gutil.log('An error occurred bundling: ' + err);
    this.emit('end');
}

function bundleScript(opt) {
    if(!opt.source) {
        throw new Error('"opt.source" is required.');
    }
    if(!opt.dest) {
        throw new Error('"opt.dest" is required.');
    }

    var filePath = opt.source;
    var outDir = opt.dest;
    var watch = opt.watch;

    var details = path.parse(filePath);
    var outFile = details.name + '.bundle' + details.ext;

    var props = { entries: [filePath], debug: true, cache: {}, packageCache: {}, paths: ['./'] };
    var bundler = browserify(props);

    function rebundle() {
        return bundler
            .bundle()
            .on('error', handleError)
            .pipe(source(outFile))
            .pipe(gulp.dest(outDir));
    }

    if (watch) {
        bundler = watchify(bundler);
        
        bundler.on('update', function () {
            rebundle();
            gutil.log('Rebundle...');
        });
    }


    return rebundle();
}

module.exports = bundleScript;
