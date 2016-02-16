'use strict';
var mergeStream = require('merge-stream');
var gulp = require('gulp');
var PluginError = require('gulp-util').PluginError;
var vendorLibs = require(process.cwd() + '\\vendor.json'); // vendor.json itself

var PLUGIN_NAME = 'gulp-vendor-sources.js';

validate(); // validation

/**
 * Cache for `getDebugFilePaths` method
 * @type {string[]}
 */
var debugFilePathsCatch;

/**
 * Cache for `getReleaseRelativeFilePaths` method
 * @type {string[]}
 */
var releaseInjectPathsCatch;

/**
 * Cache for `getReleaseFilePaths` method
 * @type {string[]}
 */
var releaseFilePaths;

/**
 * Validate vendor.json
 */
function validate() {
    if (!vendorLibs || !vendorLibs.length) {
        console.error('vendor.json is invalid');
        throw new PluginError(PLUGIN_NAME, 'vendor.json is invalid');
    }

    for (var i = 0; i < vendorLibs.length; i++) {
        var lib = vendorLibs[i];

        if (!lib) {
            console.error('vendor.json is invalid');
            throw new PluginError(PLUGIN_NAME, 'vendor.json is invalid');
        }

        if (!lib.source) {
            console.error('vendor.json validation error: `source` was not specified');
            throw new PluginError(PLUGIN_NAME, 'vendor.json validation error: `source` was not specified');
        }
    }
}

/**
 * Iterate vendor files for release build configuration and copy to specified folder
 * @param {string} vendorFolder relative path to release vendor folder
 * @returns {*} gulp piped stream
 */
function copyRelease(vendorFolder) {
    vendorFolder = trimPath(vendorFolder) + '/';

    var streams = [];

    for (var i = 0; i < vendorLibs.length; i++) {
        var vendorLibConfig = vendorLibs[i];
        if (!vendorLibConfig.copy) {
            continue;
        }

        var libFolder = trimPath(vendorLibConfig.source); // root folder with vendor lib files
        var libName = vendorLibConfig.name || libFolder.substr(libFolder.lastIndexOf('/') + 1); // name of the lib

        var paths = [];
        for (var j = 0; j < vendorLibConfig.copy.length; j++) {
            paths.push(libFolder + '/' + trimPath(vendorLibConfig.copy[j]));
        }

        streams.push(
            gulp.src(paths, {base: libFolder})
                .pipe(gulp.dest(vendorFolder + libName)));
    }

    return mergeStream(streams);
}

/**
 * Get vendor files paths from release build folder for injection into index.html
 * @param {string} vendorFolder relative path to release vendor folder
 * @returns {string[]}
 */
function getReleaseInjectPaths(vendorFolder) {
    if (!vendorFolder) {
        vendorFolder = '';
    }
    if (releaseInjectPathsCatch) {
        return releaseInjectPathsCatch.slice(0);
    }

    var paths = [];
    for (var i = 0; i < vendorLibs.length; i++) {
        var vendorLib = vendorLibs[i];
        var inject = vendorLib.inject;
        if (!inject) {
            continue;
        }
        var libFolder = trimPath(vendorLib.source);
        var libName = vendorLib.name || libFolder.substr(libFolder.lastIndexOf('/') + 1); // name of the lib

        for (var j = 0; j < inject.length; j++) {
            paths.push(vendorFolder + libName + '/' + trimPath(inject[j]));
        }
    }
    releaseInjectPathsCatch = paths;
    return paths.slice(0);
}

/**
 * Get list of paths of release files
 * @returns {string[]}
 */
function getReleaseFilePaths() {
    if (releaseFilePaths) {
        return releaseFilePaths.slice(0);
    }

    var paths = [];
    for (var i = 0; i < vendorLibs.length; i++) {
        var vendorLib = vendorLibs[i];
        var inject = vendorLib.inject;
        if (!inject) {
            continue;
        }
        var libFolder = trimPath(vendorLib.source);

        for (var j = 0; j < inject.length; j++) {
            paths.push(libFolder + '/' + trimPath(inject[j]));
        }
    }
    releaseFilePaths = paths;
    return paths.slice(0);
}

/**
 * Get vendor files paths from sources folder for injection
 * @returns {string[]}
 */
function getDebugFilePaths() {
    if (debugFilePathsCatch) {
        return debugFilePathsCatch.slice(0);
    }
    var paths = [];
    for (var i = 0; i < vendorLibs.length; i++) {
        var vendorLib = vendorLibs[i];
        var debugInject = vendorLib['debug-inject'];
        if (!debugInject) {
            continue;
        }
        var libFolder = trimPath(vendorLib.source);

        for (var j = 0; j < debugInject.length; j++) {
            paths.push(libFolder + '/' + trimPath(debugInject[j]));
        }
    }
    debugFilePathsCatch = paths;
    return paths.slice(0);
}

/**
 * Trim leading and trailing '/' and '\' characters
 * @param {string} str input string
 * @returns {string} output string
 */
function trimPath(str) {
    return str.trim().replace(/^\/|\/$/g, '').replace('\\', '/');
}

module.exports = {
    copyRelease: copyRelease,
    getReleaseInjectPaths: getReleaseInjectPaths,
    getReleaseFilePaths: getReleaseFilePaths,
    getDebugFilePaths: getDebugFilePaths
};
