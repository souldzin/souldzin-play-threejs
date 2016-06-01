var gulp = require('gulp');
var yargs = require('yargs');

var gsettings = {
    taskDir: './tasks/',
};

function getTaskFunction(name, argsFn) {
    var fn = require(gsettings.taskDir + name);

    var opt = yargs
        .default('dest', './dist/')
        .required('lib')
        .boolean('watch')
        .argv;

    return function(){
        return fn(argsFn(opt));
    };
}

function createTasks() {
    gulp.task('build-scripts', getTaskFunction('build-scripts', function(opt){
        opt.source = './lib/' + opt.lib + '/src/app.js';
        opt.dest = opt.dest + opt.lib;

        return opt;
    }));

    gulp.task('build-content', getTaskFunction('build-content', function(opt){
        opt.source = './lib/' + opt.lib + '/src/';
        opt.dest = opt.dest + opt.lib;

        return opt;
    }));

    gulp.task('build', ['build-scripts', 'build-content']);
}

module.exports = createTasks;
