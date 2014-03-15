"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var Empires = module.exports = Backbone.Collection.extend({
  model: require('../models/empire'),
  initialize: function(models, opts) {
  }
});
