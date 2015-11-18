var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');

gulp.task('develop-lint', function lintTask() {
    return gulp.src('./src/main/webapp/js/modules/**/*.js')
        .pipe($.eslint())
        .pipe($.eslint.format());
});

const babel = require('gulp-babel');

gulp.task('babelify', function task() {
    return gulp.src('./src/main/webapp/js/modules/**/*.es6')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./src/main/webapp/js/modules'));
});

gulp.task('clean-scripts', function (cb) {
    del(['./src/main/webapp/js/modules/**/*.js'], cb);
});

gulp.task('scripts', ['clean-scripts'], function() {
    gulp.start(['babelify']);
});

gulp.task('default', ['scripts']);
