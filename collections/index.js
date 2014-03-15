"use strict";

var _ = require('underscore');
var fs = require('fs');

module.exports = [];

fs.readdirSync(__dirname).forEach(function(file) {


  if (file === 'index.js') {
    return;
  }

  if ( file.substr(0,1) === '.' ) {
    return;
  }

  if ( file.substr(0,1) === '#' ) {
    return;
  }

  var stats = fs.statSync(__dirname + '/' + file );

  if ( ! stats.isFile()) {
    return;
  }

  var name = file.substr(0, file.indexOf('.'));
  var key = name.substr(0,1).toUpperCase() + name.substr(1);
  module.exports[key] = require('./' + name);

});
