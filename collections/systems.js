"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var Systems = module.exports = Backbone.Collection.extend({
  model: require('../models/system'),
  initialize: function(models, opts) {
    //_.bindAll(this, 'url');
  }
});
