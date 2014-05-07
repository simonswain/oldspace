"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var Stars = module.exports = Backbone.Collection.extend({
  model: require('../models/star'),
  initialize: function(models, opts) {
  }
});
