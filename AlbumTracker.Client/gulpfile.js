global.__base = __dirname + '/'; // trick for global paths relative to gulpfile.js

require('./gulp/debug.js');
require('./gulp/release.js');
