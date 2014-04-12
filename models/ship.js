"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');
var uuid = require('node-uuid');

var Ship = module.exports = Backbone.Model.extend({
  defaults: { 
    id: null,
    state: 'planet',
    intent: null,
    name:'Unknown Ship', 
    ux:null, // universex
    uy:null, // universey
    x:null, // systemx
    y:null, // systemy
    vx: 0, 
    vy: 0,
    a: 0, // angle
    v: 0, // velocity
    warp: 0, // warp drive range
    impulse: 1, // grav drive power
    laser: 0, // laser power
    range: 0, // laser range
    missile: 0,
    energy_max: 0,
    energy: 0,
    recharge: 1,
    power: 0,
    damage: 0,
    shield: 0,
  },
  interval: 20,
  initialize: function(vals, opts) {
    _.bindAll(this, 'run','runSpace','runPlanet','runSpace','stop');
    this.set({
      id: uuid.v4()
    });
    this.empire = opts.empire;
    this.planet = opts.planet;
    this.system = opts.planet.system;
    this.target_system = null;

    console.log(' ~ NEW SHIP ', this.get('id'), this.empire.get('name'));
    
    this.ticks = 0;

    // this.set({
    // });

    this.timer = false;
    this.run();

  },
  runPlanet: function(){
  },
  runSystem: function(){
  },
  runSpace: function(){
    // if(this.ticks === 60){
    //   console.log('       ship ', this.get('id'), this.empire.get('name') + ' @ ' + this.system.get('name') + ': ' + this.get('state'));
    //   this.ticks = 0;
    // }
  },
  run: function(){
    this.ticks ++;

    switch(this.get('state')){
      case 'planet':
      this.runPlanet();
      break;

      case 'system':
      this.runSystem();
      break;

      case 'space':
      this.runSpace();
      break;
    }
    this.timer = setTimeout(this.run, this.interval);
  },
  stop: function(){
  },

  enterSystem: function(system){
    this.system = system;
    this.set({state: 'system'});
  },
  leaveSystem: function(system){
    this.system = null;
  },

  enterPlanet: function(planet){
    this.planet = planet;
    this.set({state: 'planet'});
  },
  leavePlanet: function(planet){
    this.planet = null;
  }


});

