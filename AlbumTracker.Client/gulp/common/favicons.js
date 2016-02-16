'use strict';
var gulp = require('gulp');
var gulpRealFavicon = require('gulp-real-favicon');
var fs = require('fs');
var del = require('del');
var runSequence = require('run-sequence');

var cfg = require(__base + 'gulp/config.js');

var baseFolder = './favicons/';

// File where the favicon markups are stored
var DEBUG_FAVICON_DATA_FILE = baseFolder + 'debugFaviconData.json';
var RELEASE_FAVICON_DATA_FILE = baseFolder + 'releaseFaviconData.json';

// Source image for favicons. Should be 260x260	for optimal results.
var FAVICON_TEMPLATE = baseFolder + 'src/favicon-template.png';

// NOTE: checkout https://realfavicongenerator.net/

/**
 * Generate favicons, and configs for debug end release. You shoud run this task only when favicon was changed
 */
gulp.task('favicon:generate', function (callback) {
    runSequence(
        ['favicon:clean-temp'],
        ['debug:favicon:generate'],
        ['release:favicon:generate'],
        // Last task will generate the same favicon files like previous task.
        // But also it will generate config file. We need it to inject icons into release index.html correctly.
        callback);
});

/**
 * Generate favicons and config file for debug mode
 */
gulp.task('debug:favicon:generate', function (done) {
    generateFavIcon(
        done,
        DEBUG_FAVICON_DATA_FILE,
        baseFolder + 'dist',
        'favicons/',
        cfg.buildNumber
    );
});

/**
 * Generate favicons and config file for release mode
 */
gulp.task('release:favicon:generate', function (done) {
    generateFavIcon(
        done,
        RELEASE_FAVICON_DATA_FILE,
        baseFolder + 'dist',
        '', // relative path to icons for html
        cfg.buildNumber // NOTE: We can change that value only if favicon was changed
    );
});

/**
 * Clean temp folder
 */
gulp.task('favicon:clean-temp', function () {
    return del([
        baseFolder + 'dist/**/*.*'
    ]);
});

/**
 * Copy favicon files to release folder
 */
gulp.task('release:favicon:copy', function () {
    return gulp.src(baseFolder + 'dist/*.*')
        .pipe(gulp.dest(cfg.release.outputIndexFolder)); // next to the release index.html
});

function generateFavIcon(callback, configPath, destinationFolder, iconsPath, versionCode) {
    gulpRealFavicon.generateFavicon({
        masterPicture: FAVICON_TEMPLATE,
        dest: destinationFolder,
        iconsPath: iconsPath,
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '0%',
                appName: 'PS-Team'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                appName: 'PS-Team'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: 'PS-Team',
                    display: 'browser',
                    orientation: 'notSet',
                    onConflict: 'override'
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 60,
                themeColor: '#5bbad5'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        versioning: {
            paramName: 'ver',
            paramValue: versionCode // NOTE: Change that value if icon will change
        },
        markupFile: configPath
    }, function () {
        callback();
    });
}

module.exports = {
    // Inject the favicon markups in your HTML pages.
    debugInjectFavicon: function () {
        return gulpRealFavicon.injectFaviconMarkups(getFaviconHtmlCode(DEBUG_FAVICON_DATA_FILE));
    },
    releaseInjectFavicon: function () {
        return gulpRealFavicon.injectFaviconMarkups(getFaviconHtmlCode(RELEASE_FAVICON_DATA_FILE));
        //return gulpTemplate({'favicons': getFaviconHtmlCode(RELEASE_FAVICON_DATA_FILE)});
    }
};

function getFaviconHtmlCode(path) {
    return JSON.parse(fs.readFileSync(path)).favicon.html_code;
}

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('debug:favicon:check-for-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(DEBUG_FAVICON_DATA_FILE)).version;
    gulpRealFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
        done();
    });
});
gulp.task('debug:favicon:check-for-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(RELEASE_FAVICON_DATA_FILE)).version;
    gulpRealFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
        done();
    });
});
