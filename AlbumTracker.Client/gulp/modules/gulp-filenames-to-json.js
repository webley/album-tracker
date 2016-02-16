var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');

// consts
var PLUGIN_NAME = 'gulp-filenames-to-json';

/**
 * Creates the new json file with names of the files in the input stream
 * @param [outname] - name of the new created file. 'filenames.json' by default.
 * @param [options] - options object
 */
function filenamesToJson(outname, options) {
    if (!outname || outname == '') {
        outname = 'filenames.json';
    }

    if (!options) {
        options = {};
    }

    var paths = [];  // where we will push the path names with the @import

    var write = function (file, enc, cb) {
        if (file && file.path && file.path != 'undefined') {
            var res = options.relativePath == true
                ? file.relative
                : path.basename(file.path);

            if (options.removePrefix && res.indexOf(options.removePrefix) == 0) {
                res = res.replace(options.removePrefix, '');
            }

            if (options.addPrefix) {
                res = options.addPrefix + res;
            }

            if (options.removePostfix
                && res.length >= options.removePostfix.length
                && res.substring(res.length - options.removePostfix.length) == options.removePostfix) {
                res = res.substring(0, res.length - options.removePostfix.length);
            }

            if (options.addPostfix) {
                res = res + options.addPostfix;
            }

            if (options.pathSeparator) {
                res = res.replace(new RegExp('\\\\', 'g'), options.pathSeparator);
            }

            paths.push(res);
        }
        cb();
    };

    var flush = function (cb) {  // flush occurs at the end of the concating from write()
        var newFile = new gutil.File({  // create a new file
            base: __dirname,
            cwd: __dirname,
            path: __dirname + '/' + outname,
            contents: new Buffer(JSON.stringify(paths))
        });

        this.push(newFile);  // push the new file to gulp's stream
        cb();
    };

    return through.obj(write, flush);  // return it
}

// exporting the plugin main function
module.exports = filenamesToJson;
