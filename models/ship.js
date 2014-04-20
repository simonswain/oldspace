"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');
var uuid = require('node-uuid');

var Ship = module.exports = Backbone.Model.extend({
  defaults: { 
    id: null,
    state: 'system',
    intent: 'fight',
    name:'Ship', 
    ux:null, // universex
    uy:null, // universey
    x:null, // systemx
    y:null, // systemy
    vx: 0, 
    vy: 0,
    a: 0, // angle
    v: 0, // velocity
    warp: 0, // warp drive range
    thrust: 1, // grav drive power
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
    _.bindAll(this, 'run','runSpace','runPlanet','runSpace','stop','systemPhysics');
    this.set({
      id: uuid.v4()
    });

    // ship belongs to this empire
    this.empire = opts.empire;

    // ship is at this planet (starts with birth planet)
    this.planet = opts.planet;
    
    // ship is at this system
    this.system = opts.planet.system;

    this.target_planet = null;
    this.target_system = null;

    console.log(' ~ NEW SHIP ', this.get('id'), this.empire.get('name'));
    
    this.ticks = 0;

    // this.set({
    // });

    this.timer = false;
    this.run();

  },
  runPlanet: function(){
    // things to do when the ship is on a planet

    var state = this.get('state');
    var intent = this.get('intent');

    // repaired? cargo? fuel?

    if(this.get('cargo') > 10){
      // ready to leave
      intent = 'jump';
      this.leavePlanet();
      return;
    }

    // fake some trading
    this.set({cargo: s.cargo + 1});
    
    // repairs
    
      // 


  },
  runSystem: function(){
    // things to do when the ship is in a system

    this.systemPhysics();

  },
  runSpace: function(){
    // things to do when the ship is in deep space

    

  },
  run: function(){
    this.ticks ++;
    var s = this.toJSON();
    var state = this.get('state');
    var intent = this.get('intent');

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
  },
  systemPhysics: function(){

    var ship = this;

    var intent = ship.get('intent');

    var x, y, vx, vy, a, v, gx, gy, thrust, angle;

    var radius;
    radius = this.system.get('radius');

    x = Number(ship.get('x'));
    y = Number(ship.get('y'));

    vx = Number(ship.get('vx'));
    vy = Number(ship.get('vy'));

    thrust = Number(ship.get('thrust'));

    _.each(
      this.system.planets.models, 
      function(planet){

        var g, px, py, angle;

        px = planet.get('x');
        py = planet.get('y');

        // angle between ship and planet
        var theta = G.angle ( px, py, x, y );
        // angle between ship and planet
        var r = G.distance ( x, y, px, py );

        // gravity

        // force of gravity from planets on ship
        
        // calc gravity vector
        g = 1000 * ( 50 / ( r * r ) )

        if ( g > 10 ) {
          g = 10;
        }

        // convert gravity to xy. apply
	vx = vx + g * Math.cos(theta);
	vy = vy + g * Math.sin(theta);

        //console.log(ra_de(theta), r, g);
        // ship thrust based on intent
        
        //console.log(ra_de(theta).toFixed(2), r.toFixed(2), g.toFixed(2), vx.toFixed(2), vy.toFixed(2));

        // console.log(angle, thrust);
        if(intent === 'jump'){
          // thrust away from planet to get to edge of system
          angle = de_ra ( ra_de (theta)+  180 ); 
	  vx = vx + (0.5 * thrust) * Math.cos(angle);
	  vy = vy + (0.5 * thrust) * Math.sin(angle);
        }

        if(intent === 'fight'){
          //thrust ship at 90 deg to planet to stay in system
          angle = de_ra ( ra_de (theta) + 90 ); 
	  vx = vx + (0.5 * thrust * g) * Math.cos(angle);
	  vy = vy + (0.5 * thrust * g) * Math.sin(angle);
        }

      });

    // if(intent === 'planet'){
    //   // thrust towards planet
    //   // target planet
    //   angle = de_ra ( ra_de (theta) + 90 ); 
    //   vx = vx + thrust * Math.cos(angle);
    //   vy = vy + thrust * Math.sin(angle);
    // }
    
    var inner = radius;
    // damping
    vx = vx * 0.92;
    vy = vy * 0.92;

    x = x + Number(vx);
    y = y + Number(vy);

    if ( x < (inner * 0.1) ) {
      x = (inner * 0.1);
      vx = - vx * 0.1;
    }

    if ( x > (inner * 0.8) ) {
      x = (inner * 0.8);
      vx = - vx * 0.1;
    }

    if ( y < (inner * 0.1) ) {
      y = (inner * 0.1);
      vy = - vy * 0.1;
    }

    if ( y > (inner * 0.8) ) {
      y = (inner * 0.8);
      vy = - vy * 0.1;
    }

    // angle ship is facing
    a = ra_de ( G.angle ( 0, 0, vx, vy ) ) - 90;

    //console.log(a.toFixed(4), x.toFixed(4), y.toFixed(4), vx.toFixed(4), vy.toFixed(4));

    // ship.energypc = ( 100 / ship.energy_max ) * ship.energy;
    // ship.energyf = ( 1 / ship.energy_max ) * ship.energy;
    ship.set({
      x: x.toFixed(2),
      y: y.toFixed(2),
      vx: vx.toFixed(2),
      vy: vy.toFixed(2),
      a: a.toFixed(2)
    });
  }

});

var G = {
  angle: function  ( x1, y1, x2, y2 ) {
    var x = x1 - x2;
    var y = y1 - y2;
    return Math.atan2(y,x);
  },
  distance: function ( x1, y1, x2, y2 ) {
    var x = Math.abs(x1-x2);
    var y = Math.abs(y1-y2);
    return Math.sqrt( (x*x) + (y*y) );
  },
}

function ra_de(r) {
  return r*(180/Math.PI);
}

function de_ra(d) {
  var pi = Math.PI;
  return (d)*(pi/180);
}
