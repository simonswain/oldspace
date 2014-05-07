"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');
var uuid = require('node-uuid');

var App;
App = {
  Models: require('../models'),
  Collections: require('../collections')
};

var types = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];

var hues = {
  'O': '#9bb0ff',
  'B': '#aabfff',
  'A': '#cad7ff',
  'F': '#f8f7ff',
  'G': '#fff4ea',
  'K': '#ffd2a1',
  'M': '#ffcc6f'
};

var Star = module.exports = Backbone.Model.extend({
  defaults: {
    'id': null,
    'name':'Unknown Star',
    'size': 1,
    'type': null,
    'x':null,
    'y':null
  },
  initialize: function(opts) {
    var type = types[random.from0to(types.length-1)];
var size = 1 + random.from0to(5);
    this.set({
      id: uuid.v4(),
      type: type,
      size: size
    });

    this.system = opts && opts.system || null;

  }

});
