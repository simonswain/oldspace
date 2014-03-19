"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');
var uuid = require('node-uuid');

var Ship = module.exports = Backbone.Model.extend({
  defaults: { 
    id: null,
    name:'Unknown Ship', 
    x:null,
    y:null,
    vx: 0,
    vy: 0,
    a: 0, // angle
    v: 0, // velocity
    warp: 0, // warp drive range
    grav: 1, // grav drive power
    laser: 0, // laser power
    ramge: 0, // laser range
    missile: 0,
    energy_max: 0,
    energy: 0,
    recharge: 0,
    power: 0,
    damage: 0,
    shield: 0,
  },
  interval: 20,
  initialize: function(vals, opts) {
    _.bindAll(this, 'run','stop');

    this.set({
      id: uuid.v4()
    });

    this.empire = opts.empire;
    this.planet = opts.planet;
    this.system = opts.planet.system;

    console.log(' ~ NEW SHIP ', this.get('id'), this.empire.get('name'));
    
    this.ticks = 0;

    // this.set({
    // });

    this.timer = false;
    this.run();

  },
  run: function(){
    this.ticks ++;

    if(this.ticks = 15){
      //console.log('       ship ', this.get('id'), this.empire.get('name') + ' @ ' + this.system.get('name'));
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

