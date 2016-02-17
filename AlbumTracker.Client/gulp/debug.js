// JSHint
/* jshint node:true */

var gulp = require('gulp'); // gulp core
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var gulpLess = require('gulp-less'); // less compiler
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var inject = require('gulp-inject'); // injects js/css files to the index.html
var angularFilesort = require('gulp-angular-filesort'); // sort angular js files in proper order
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps'); // sourcemap tool
var gulpHash = require('gulp-hash'); // hashing tool
var path = require('path');
var less = require('less');
var del = require('del');
var through = require('through2');
var runSequence = require('run-sequence');

var vendorFiles = require('./modules/gulp-vendor-sources.js');
var translations = require('./common/translations.js');
var favicons = require('./common/favicons.js');
var gulpLessImports = require('./modules/gulp-less-imports.js');
var cfg = require('./config.js');

var lessGlobs = ['./src/**/*.less', './src/**/*.css', '!./src/app.less'];
var debugOutputPath = './debug';
var livereloadPort = 35729;

var gulpHashOpts = {
    algorithm: 'sha1',
    hashLength: 40,
    template: '<%= name %><%= ext %>?hash=<%= hash %>'
};

gulp.task('debug:inject', function () {
    return gulp.src('./src/index.template.html')

        // vendor js/css
        .pipe(inject(
            gulp.src(vendorFiles.getDebugFilePaths()).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                starttag: '<!-- inject:vendor:{{ext}} -->'
            }))
        // livereload
        .pipe(replace('<!-- livereload js file will go here -->', '<script src="//localhost:'+livereloadPort+'/livereload.js"/>'))
        // config js
        .pipe(inject(
            gulp.src(['./src/app/configuration/*.*']).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                ignorePath: 'src/',
                starttag: '<!-- inject:config:js -->'
            }))

        // app css/less
        .pipe(inject(
            gulp.src(['debug/app.css']).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                ignorePath: 'debug/',
                starttag: '<!-- inject:app:css -->'
            }))

        // app js
        .pipe(inject(
            gulp.src([
                './src/**/*.js',
                '!./src/**/*.spec.js',
                '!./src/app/configuration/*.*'
                // '!' + config.configFile
            ]).pipe(angularFilesort()).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                ignorePath: 'src/',
                starttag: '<!-- inject:app:js -->'
            }))
        // sprites css
        .pipe(inject(
            gulp.src(['./debug/sprites.css']).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                ignorePath: 'debug/',
                starttag: '<!-- inject:sprites:css -->'
            }))

        .pipe(favicons.debugInjectFavicon())
        .pipe(rename('index.html'))
        .pipe(gulp.dest(debugOutputPath));
});

//region Favicons

/**
 * Copy favicons into release folder
 */
gulp.task('debug:favicons:deploy', function () {
    return gulp.src(['./favicons/dist/*.*']) // take all icons
        .pipe(gulp.dest(debugOutputPath + '/favicons')); // and place it next to index.html
});

//endregion

//region LESS files

/**
 * Compile less files.
 * NOTE: Now we automatically collect all `.less` files and include everything in one file. That file will be compiled to css.
 */
gulp.task('less:debug', function (callback) {
    runSequence(
        ['less:debug:import'],
        ['less:debug:compile'],
        callback);
});

/**
 * Include all less files in 'imports.less'
 */
gulp.task('less:debug:import', function () {
    return gulp.src([
            './src/**/*.+(less|css)',
            '!./src/app.css',
            '!./src/app.less',
            '!./src/imports.less',
            '!./src/sprites.css',
            '!./src/temp/css/**/*.css'
        ], {read: false}) //collecting all less files
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
            }
        }))
        .pipe(gulpLessImports('imports.less')) // and create new 'imports.less' file with @imports to these less files.
        .pipe(gulp.dest('./src'));
});

/**
 * Compile main app.less
 */
gulp.task('less:debug:compile', function () {
    return gulp.src('./src/app.less')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
            }
        }))
        .pipe(sourcemaps.init())

        // compile less
        .pipe(gulpLess({
            relativeUrls: true
        }))
        .pipe(concat('app.css'))

        // write sourcemaps right into app.css
        .pipe(sourcemaps.write(
            {includeContent: false}
        ))

        .pipe(gulp.dest(debugOutputPath))
        .pipe(livereload());
});

//endregion

// region My hacks to copy all files

gulp.task('copy-vendor', function() {
    return gulp.src('./vendor/**')
        .pipe(gulp.dest(debugOutputPath + '/vendor'));
});

gulp.task('copy-app', function() {
    return gulp.src('./src/**')
        .pipe(gulp.dest(debugOutputPath));
});

// endregion My Hack

gulp.task('debug:clean', function () {
    return del('./debug/**/*');
});

gulp.task('app:debug', function (callback) {
    runSequence(
        [
            'less:debug'
        ],
        [
            'debug:inject'
        ],
        callback);
});

gulp.task('app:debug:watch', ['full-debug'], function () {
    var cache = {};

    var livereloadFiles = vendorFiles.getDebugFilePaths();
    livereloadFiles.push('src/**/*.+(html|js)');

    livereload.listen({
        port: livereloadPort,
        livereload: './node_modules/livereload-js/dist/livereload.js'
    });

    watch(lessGlobs, {
        usePolling: true,
        interval: 100,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    }, function (file) {
        gulp.start('less:debug');
    });

    watch(['src/vendor.json', 'src/index.template.html'], {
        read: false,
        usePolling: true,
        interval: 100,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    }, function () {
        gulp.start('quick-debug');
    });

    console.log('debug-watch is now watching for changes...');

    return watch(livereloadFiles, {
        read: false,
        ignored: 'src/**/*.spec.js',
        usePolling: true,
        interval: 100,
        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 100
        }
    }, function (file) {
        if (file.event === 'add' || file.event === 'unlink') {
            console.log('new File', file.history);
            gulp.start('quick-debug');
        } else {
            livereload.reload();
        }
    });
});

gulp.task('watch', ['app:debug:watch']);
gulp.task('debug-watch', ['app:debug:watch']);

// Debug is now an alias for the full debug, that will generate all files required to run.
gulp.task('debug', ['full-debug']);

// Explicit quick-debug. Only does index html, LESS compilation, and live reload.
gulp.task('quick-debug', ['app:debug'], function () {
    livereload.reload();
});

gulp.task('full-debug', function (callback) {
    runSequence(
        [
            'debug:clean'
        ],
        [
            'less:debug',
            'copy-vendor',
            'copy-app',
            //'translations',
            'copy-angular-locale',
            'images',
            'debug:favicons:deploy'
        ],
        [
            'debug:inject'
        ],
        callback);
});
