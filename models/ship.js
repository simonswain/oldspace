"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');

var Ship = module.exports = Backbone.Model.extend({
  defaults: { 
    'name':'Unknown', 
    'x':null,
    'y':null,
  },
  interval: 20,
  initialize: function(vals, opts) {
    _.bindAll(this, 'run','stop');

    this.empire = opts.empire;
    this.planet = opts.planet;
    this.system = opts.planet.system;

    console.log(' ~ NEW SHIP ', this.empire.get('name'));
    
    this.ticks = 0;

    // this.set({
    // });

    this.timer = false;
    this.run();

  },
  run: function(){
    this.ticks ++;

    if(this.ticks = 15){
      //console.log('       ship ', this.empire.get('name') + ' @ ' + this.system.get('name'));
      this.ticks = 0;
    }
    this.timer = setTimeout(this.run, this.interval);
  },
  stop: function(){
  },

  enterSystem: function(system){
    this.system = system;
  },
  leaveSystem: function(system){
    this.system = null;
  },

  enterPlanet: function(planet){
    this.planet = planet;
  },
  leavePlanet: function(planet){
    this.planet = null;
  }


});

