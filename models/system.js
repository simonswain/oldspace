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

var System = module.exports = Backbone.Model.extend({
  defaults: { 
    'id': null,
    'name':'Unknown System',
    'radius': 1000,
    'age': 0,
    'x':null,
    'y':null
  },
  initialize: function() {
    _.bindAll(this, 'addPlanet','initPlanets','run','runShips','runShip');

    this.set({
      id: uuid.v4()
    });

    this.planetCount = random.from1to(3);
    //this.planetCount = 1;

    this.planets = new App.Collections.Planets();
    this.ships = new App.Collections.Ships();

    this.initPlanets();
    console.log( ' * ' + ' ' + this.get('name') + ' has ' + this.planets.length + ' planets')

    this.ticks = 0;
    this.timer = false;
    this.run();

  },
  runShip: function(ship){
    //var ships = this.ships;

    var x, y, vx, vy, a, v, gx, gy;

    var radius;
    radius = this.get('radius');

    x = ship.get('x');
    y = ship.get('y');

    vx = ship.get('vx');
    vy = ship.get('vy');

    _.each(
      this.planets.models, 
      function(planet){

        var g, px, py;

        px = planet.get('x');
        py = planet.get('y');

        // angle betweek ship and planet
        var theta = G.angle ( px, py, x, y );

        // angle between ship and planet
        var r = G.distance ( x, y, px, py );

        // gravity

        // force of gravity on ship
        
        // calc gravity vector
        g = 10 * ( 100 / ( r * r ) )

        if ( g > 100 ) {
          g = 100;
        }

        // convert gravity to xy. apply
	gx = g * Math.cos(theta);
	gy = g * Math.sin(theta);

	vx = vx + gx;
	vy = vy + gy;
        
        //thrust ship at 90 deg to planet

        var angle = de_ra ( ra_de (theta) + 90 ); 
	vx = vx + g * Math.cos(angle);
	vy = vy + g * Math.sin(angle);
        
      });

    // damping
    vx = vx * 0.92;
    vy = vy * 0.92;

    x = x + vx;
    y = y + vy;

    if ( x < 0 ) {
      x = 0;
      vx = - vx * 0.5;
    }

    if ( x > radius ) {
      x = radius;
      vx = - vx * 0.5;
    }

    if ( y < 0 ) {
      y = 0;
      vy = - vy * 0.5;
    }

    if ( y > radius ) {
      y = radius;
      vy = - vy * 0.5;
    }

    y = y + vy;

    // angle ship is facing
    a = ra_de ( G.angle ( 0, 0, vx, vy ) ) - 90;

    // ship.energypc = ( 100 / ship.energy_max ) * ship.energy;
    // ship.energyf = ( 1 / ship.energy_max ) * ship.energy;
    ship.set({
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      a: a
    });
  },
  runShips: function(){
    var self = this;
    _.each(
      this.ships.models,
      function(ship){
        self.runShip(ship);
      });
  },
  run: function(){
    this.ticks ++;
    this.runShips();
    this.timer = setTimeout(this.run, this.interval);
  },

  initPlanets: function(){
    while(this.planets.length < this.planetCount){
      this.addPlanet();
    }
  },

  addPlanet: function(i){
    var x, y;
    
    x = random.from0upto(this.get('radius'));
    y = random.from0upto(this.get('radius'));

    var planet = new App.Models.Planet({
      x:x,
      y:y,
      name: 'Planet ' + String(Number(this.planets.length + 1)),
    },{
      system: this
    });
    this.planets.add(planet);
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
