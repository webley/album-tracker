var through = require('through2');
var gutil = require('gulp-util');

// consts
var PLUGIN_NAME = 'gulp-less-imports';

/**
 * Creates the new less to which will be added '@import filepath' directives for each file
 * Create new .less file Import .less files to new .less file
 * @param filename - name of the new created .less file
 * @param options - options of import
 */
function gulpLessImports(filename, options) {
    if (!filename) {
        filename = 'imports.less';
    }

    // options parameters:
    // importType - reference, inline, less, css, once, multiple; once by default
    // ignorePrefix - prefix to ignore
    // addPrefix - prefix to add before path
    // addRootSlash - if true, it'll add leading slash
    // transform - function(filePath) - custom transform function
    if (!options) {
        options = {};
    }

    var transform = options.transform || function (filePath) {
            var result = '' + filePath;

            if (options.ignorePrefix && filePath.indexOf(options.ignorePrefix) == 0) {
                result = result.replace(options.ignorePrefix, '');
            }

            if (options.addPrefix) {
                result = options.addPrefix + result;
            }

            if (options.addRootSlash && result[0] != '/') {
                result = '/' + result;
            }

            var keyword = '';
            if (options.importType) {
                keyword = ' (' + options.importType + ')';
            }

            return '@import' + keyword + ' "' + result + '"';
        };

    var paths = '';  // where we will push the path names with the @import

    var write = function (file, enc, cb) {

        if (file && file.path && file.path != 'undefined') {
            var t = transform(file.relative);
            if (t) {
                paths = paths + t.replace(/\\/g, '/') + ';\n';
            }
        }
        cb();
    };

    var flush = function (cb) {  // flush occurs at the end of the concating from write()

        var newFile = new gutil.File({  // create a new file
            base: __dirname,
            cwd: __dirname,
            path: __dirname + '/' + filename,
            contents: new Buffer(paths)  // set the contents to the paths we created
        });

        this.push(newFile);  // push the new file to gulp's stream
        cb();
    };

    return through.obj(write, flush);  // return it
}

// exporting the plugin main function
module.exports = gulpLessImports;
