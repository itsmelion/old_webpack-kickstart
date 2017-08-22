const gulpWebpack = require('webpack-stream');
const gulp = require('gulp');
const gzip = require('gulp-gzip');
const mqpacker = require('css-mqpacker');
// const elixir = require('laravel-elixir');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const {
    phpMinify
} = require('@cedx/gulp-php-minify');
// Configuration
const
    url = 'dev.studentbackr', // Local Development URL for BrowserSync.
    config = {
        dist: './dist/',
        src: './src/'
    };


gulp.task('default', () => {
    runSequence(['styles', 'images', 'php'], ['gzip'], () => {
        gulp.watch(config.src + '**/*', ['webpack']);
    });
});

gulp.task('webpack', () => {
    gulpWebpack(require('./webpack.config.js'))
});

// Task to pack media queries together
gulp.task('styles', () => {
    gulp.src(config.dist + '*.css')
        .pipe(mqpacker())
});

// Image minification
gulp.task('images', () => {
    gulp.src(config.dist + 'images/**/*.{png,jpg,jpeg,gif,svg}')
        .pipe(imagemin({
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        }))
    // .pipe(rev())
});

// task to minify application for faster server content delivery
gulp.task('php', () => {
    gulp.src('./app/**/*.php', {
            read: false
        })
        .pipe(phpMinify())
        .pipe(gulp.dest('./appMinified/'))
});

gulp.task('gzip', () => {
    gulp.src(config.dist)
        .pipe(gzip())
        .pipe(gulp.dest(config.dist))
});
