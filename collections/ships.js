"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var Ships = module.exports = Backbone.Collection.extend({
  model: require('../models/ship'),
  initialize: function(models, opts) {
    //_.bindAll(this, 'url');
  }
});
