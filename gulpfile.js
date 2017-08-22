var gulp = require('gulp');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');

gulp.task('default', () => {
    return gulp.src('src/entry.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'))
});
