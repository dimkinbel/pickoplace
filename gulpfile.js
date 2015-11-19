var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');

gulp.task('develop-lint', function lintTask() {
    return gulp.src('./src/main/webapp/js/modules/src/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});

const babel = require('gulp-babel');

gulp.task('babelify', function task() {
    return gulp.src('./src/main/webapp/js/modules/src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./src/main/webapp/js/modules/dist'));
});

gulp.task('clean-scripts', function (cb) {
    del(['./src/main/webapp/js/modules/dist/asdas']).then(function() {
        cb();
    });
});

gulp.task('scripts', ['clean-scripts'], function task() {
    gulp.start(['babelify']);
});

gulp.task('default', ['scripts']);
