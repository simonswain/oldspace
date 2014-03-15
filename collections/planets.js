"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var Planets = module.exports = Backbone.Collection.extend({
  model: require('../models/planet'),
  initialize: function(models, opts) {
  }
});
