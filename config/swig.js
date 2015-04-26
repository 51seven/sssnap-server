var path = require('path');
var swig = require('swig');

// SWIG CONFIGURATIONS
// =========================================================
//
// This is a playground for accessing the Swig API to add
// custom tags, filters and more.
// See http://paularmstrong.github.io/swig/docs/api/


module.exports = function (cons) {
  return function (req, res, next) {

    /* swig.setFilter('test', function (string) {
      return 'test' + string + 'test';
    }); */

    swig.setDefaults({ loader: swig.loaders.fs(path.join(__dirname, '../views/templates'))});

    cons.requires.swig = swig;
    next();
  }
}
