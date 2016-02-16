// JSHint
/* jshint node:true */

var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');

var outputFolder = './debug/';

module.exports = {
    outputFolder: outputFolder
};

gulp.task('spritesmith', function () {
    return gulp.src(['src/assets/**/*.png'])

        .pipe(spritesmith({
            imgName: 'sprites.png',
            cssName: 'sprites.css'
        }))

        .pipe(gulp.dest(outputFolder));
});

gulp.task('images', ['spritesmith'], function () {
    return gulp.src(outputFolder + 'sprites.png')

        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 3,
            svgoPlugins: [
                {
                    removeViewBox: false
                }
            ]
        }))

        .pipe(gulp.dest(outputFolder));
});
