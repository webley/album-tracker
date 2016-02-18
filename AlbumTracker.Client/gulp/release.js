var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mincss = require('gulp-minify-css');
var minhtml = require('gulp-minify-html');
var ngtemplate = require('gulp-angular-templatecache');
var streamqueue = require('streamqueue');
var gulpLess = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var ngannotate = require('gulp-ng-annotate');
var inject = require('gulp-inject'); // injects js/css files to the index.html
var angularFilesort = require('gulp-angular-filesort'); // sort angular js files in proper order
var gulpHash = require('gulp-hash'); // hashing tool
var runSequence = require('run-sequence');
var del = require('del');


var vendorFiles = require('./modules/gulp-vendor-sources.js');
var translations = require('./common/translations.js');
var gulpLessImports = require('./modules/gulp-less-imports.js');
var images = require('./common/images.js');
var favicons = require('./common/favicons.js');
var cfg = require('./config.js');

var outputVendorFolder = cfg.release.outputVendorFolder;
var outputVendorScriptsFolder = outputVendorFolder + 'scripts/';
var outputVendorCssFolder = outputVendorFolder + 'styles/';
var outputVendorFontsFolder = outputVendorFolder + 'fonts/';

var gulpHashOpts = {
    algorithm: 'sha1',
    hashLength: 40,
    template: '<%= name %><%= ext %>?hash=<%= hash %>'
};

gulp.task('default', ['build']);
gulp.task('release', ['build']);

gulp.task('build', [], function (callback) {
    runSequence(
        [
            'release:clean',
            'release:less:import'
        ],
        [
            'release:favicons:deploy',
            'release:less:compile',
            'icons.release',
            'fonts.release',
            'translations.release',
            'images.release',
            'assets',
            'configs',
            'appjs',
            'release:vendor'
        ],
        [
            'index'
        ],
        callback);
});

gulp.task('release:clean', function () {
    return del([cfg.release.outputFolder + '**/*'], {force: true});
});

//region Favicons

/**
 * Copy favicons into release folder
 */
gulp.task('release:favicons:deploy', function () {
    return gulp.src(['./favicons/dist/*.*']) // take all icons
        .pipe(gulp.dest(cfg.release.outputIndexFolder)); // and place it next to index.html
});

//endregion

//region Vendor files

gulp.task('release:vendor', ['release:vendor:js', 'release:vendor:css', 'release:vendor:woff']);

gulp.task('release:vendor:js', function () {
    return gulp.src(vendorFiles.getReleaseFilePaths())
        .pipe(filter('**/*.js'))
        .pipe(concat('vendor.min.js'), {
            newLine: '\n;' // the newline is needed in case the file ends with a line comment, the semi-colon is needed if the last
                           // statement wasn't terminated
        })
        .pipe(gulp.dest(outputVendorScriptsFolder));
});

gulp.task('release:vendor:css', function () {
    return gulp.src(vendorFiles.getReleaseFilePaths())
        .pipe(filter('**/*.css'))
        .pipe(concat('vendor.min.css'))
        .pipe(mincss())
        .pipe(gulp.dest(outputVendorCssFolder));
});

gulp.task('release:vendor:woff', function () {
    return gulp.src(vendorFiles.getReleaseFilePaths())
        .pipe(filter('**/*.woff'))
        .pipe(gulp.dest(outputVendorCssFolder));
});

//endregion

gulp.task('assets', function () {
    return gulp.src(['./src/assets/**/*.*'])
        .pipe(gulp.dest(cfg.release.outputAssetsFolder));
});

gulp.task('configs', function () {
    return gulp.src(['./src/app/configuration/*.*'])
        .pipe(concat('config.js'))
        .pipe(gulp.dest(cfg.release.outputConfigFolder));
});

gulp.task('templates', function () {
    return gulp.src(['./src/**/*.tpl.html'])
        .pipe(minhtml({
            empty: true
        }))
        .pipe(ngtemplate('templates.js', {
            module: 'app'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(cfg.release.outputFolder));
});

gulp.task('appjs', function () {
    return streamqueue(
        {
            objectMode: true
        },

        gulp.src([
            './src/**/*.js',
            '!./src/**/*.spec.js',
            '!./src/app/configuration/*.*'
        ]),

        gulp.src(['./src/**/*.tpl.html'])
            .pipe(minhtml({
                empty: true
            }))
            .pipe(ngtemplate('templates.js', {
                module: 'app'
            })))

        .pipe(ngannotate({
            remove: false,
            add: true,
            single_quotes: true
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./debug/maps/'))
        .pipe(gulp.dest(cfg.release.outputFolder));
});

//region Less

/**
 * Collect all less files into imports.less
 */
gulp.task('release:less:import', function () {
    return gulp.src(
        [
            './src/**/*.+(less|css)',
            '!./src/app.css',
            '!./src/app.less',
            '!./src/imports.less',
            '!./src/sprites.css',
            '!./src/temp/css/**/*.css'
        ], {read: false})
        .pipe(gulpLessImports('imports.less'))
        .pipe(gulp.dest('./src/'));
});

/**
 * Compile, minify and deploy app.less
 */
gulp.task('release:less:compile', function () {
    return gulp.src('./src/app.less') // get main less files
        .pipe(sourcemaps.init()) // start sourcemap capture
        .pipe(gulpLess({relativeUrls: true})) // compile
        .pipe(concat('app.min.css')) // concatenate
        .pipe(mincss()) // minify
        .pipe(sourcemaps.write('./debug/maps/')) // create sourcemap `.map` file with sources included (path is relative to output)
        .pipe(gulp.dest(cfg.release.outputFolder)); // and deploy
});

//endregion

gulp.task('index', function () {
    return gulp.src(['./src/index.template.html'])

        .pipe(inject(
            gulp.src(outputVendorScriptsFolder + 'vendor.min.js').pipe(gulpHash(gulpHashOpts)), {
                starttag: '<!-- inject:vendor:js -->',
                ignorePath: outputVendorScriptsFolder,
                addRootSlash: false,
                addPrefix: 'vendor/scripts',
                addSuffix: cfg.buildNumberSuffix
            }))

        .pipe(inject(
            gulp.src(outputVendorCssFolder + 'vendor.min.css').pipe(gulpHash(gulpHashOpts)), {
                starttag: '<!-- inject:vendor:css -->',
                ignorePath: outputVendorCssFolder,
                addRootSlash: false,
                addPrefix: 'vendor/styles',
                addSuffix: cfg.buildNumberSuffix
            }))

        .pipe(inject(
            gulp.src(cfg.release.outputFolder + 'app.min.js')
                .pipe(angularFilesort())
                .pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                starttag: '<!-- inject:app:js -->',
                ignorePath: cfg.release.outputFolder,
                addSuffix: cfg.buildNumberSuffix
            }))

        .pipe(inject(
            gulp.src(cfg.release.outputFolder + 'app.min.css').pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                starttag: '<!-- inject:app:css -->',
                ignorePath: cfg.release.outputFolder,
                addSuffix: cfg.buildNumberSuffix
            }))

        .pipe(inject(
            gulp.src(cfg.release.outputConfigFolder + '/*.*').pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                starttag: '<!-- inject:config:js -->',
                ignorePath: cfg.release.outputConfigFolder,
                addPrefix: 'configuration',
                addSuffix: cfg.buildNumberSuffix
            }))

        // sprite css
        .pipe(inject(
            gulp.src(['./debug/sprites.css']).pipe(gulpHash(gulpHashOpts)), {
                addRootSlash: false,
                starttag: '<!-- inject:sprites:css -->',
                ignorePath: 'debug/',
                addSuffix: cfg.buildNumberSuffix
            }))
        .pipe(favicons.releaseInjectFavicon())
        .pipe(minhtml({
            empty: true
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(cfg.release.outputFolder));
});

gulp.task('icons.release', function () {
    return gulp.src(['./vendor/other_vendor/fonts/**/*.*']);
        //.pipe(gulp.dest(outputVendorCssFolder));
});

gulp.task('fonts.release', function () {
    return gulp.src('./vendor/bower_components/font-awesome/fonts/*.*')
        .pipe(gulp.dest(outputVendorCssFolder));
});

gulp.task('translations.release', ['translations'], function () {
    var languagesPath = path.resolve(
        translations.outputTranslationsFolder,
        'languages.json');

    var supportedLanguageCodes =
        JSON.parse(fs.readFileSync(languagesPath));

    var files = [translations.outputTranslationsFolder + '*.json'];

    files = supportedLanguageCodes.reduce(function (localeFiles, language) {
        localeFiles.push(
            './vendor/bower_components/angular-i18n/angular-locale_' +
            language + '.js');

        return localeFiles;
    }, files);

    return gulp.src(files)
        .pipe(gulp.dest(cfg.release.outputTranslationsFolder));
});

gulp.task('images.release', ['images'], function () {
    return gulp.src([
            images.outputFolder + 'sprites.png',
            images.outputFolder + 'sprites.css'
        ])
        .pipe(gulp.dest(cfg.release.outputFolder));
});
