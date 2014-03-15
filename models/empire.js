"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');

var App;
App = {
  Models: require('../models'),
  Collections: require('../collections')
};

var Empire = module.exports = Backbone.Model.extend({
  defaults: { 
    'id': null,
    'name':'Unknown',
    'radius': 1000,
    'age': 0,
    'x':null,
    'y':null
  },
  initialize: function() {
    _.bindAll(this, 'addSystem','removeSystem');

    this.systems = new App.Collections.Systems();
    this.ships = new App.Collections.Ships();

    console.log(' $ ' + this.get('name'))
  },
  addSystem: function(system){
    console.log(' + ' + this.get('name') + ' owns ' + system.get('name'))
    //console.log(' > ' + this.get('name') + ' added ' + system.get('name'));
    if(this.system && this.system.empire){
      this.system.empire.removeSystem(this.system);
    }
    system.empire = this;
    this.systems.add([system]);

  },
  removeSystem: function(system){
    this.systems.remove(system);
    system.empire = null;
  }

});

