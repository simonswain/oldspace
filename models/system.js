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
    'x':null,
    'y':null
  },
  initialize: function() {
    _.bindAll(this, 'addPlanet','initPlanets');

    this.set({
      id: uuid.v4()
    });

    this.starCount = 1;

    this.planetCount = random.from1to(3);
    //this.planetCount = 1;

    this.stars = new App.Collections.Stars();
    this.planets = new App.Collections.Planets();
    this.ships = new App.Collections.Ships();

    this.initStars();
    this.initPlanets();
    //console.log( ' * ' + ' ' + this.get('name') + ' has ' + this.planets.length + ' planets')

  },

  initStars: function(){
    while(this.stars.length < this.starCount){
      this.addStar();
    }
  },

  addStar: function(i){

    // only allowing one star, in the center of the system for now,
    // but keeping in collection to we can have more later

    var self = this;

    var x, y;

    var d;
    if(this.stars.length === 0){
      x = this.get('radius')/2;
      y = this.get('radius')/2;
    }

    var star = new App.Models.Star({
      x:x,
      y:y,
      name: 'Star',
      system: this
    });

    this.stars.add(star);
  },

  initPlanets: function(){
    while(this.planets.length < this.planetCount){
      this.addPlanet();
    }
  },

  addPlanet: function(i){
    var planet = new App.Models.Planet({
      name: 'Planet ' + String(Number(this.planets.length + 1)),
      system: this
    });
    this.planets.add(planet);
  },

  addPlanetXY: function(i){

    var self = this;

    var x, y;
    var d;
    var spacing = this.get('radius') * 0.3;

    var gen = function(){
      return (self.get('radius') * 0.3) + random.from0upto(self.get('radius') * 0.4);
    };


    d = 0;

    if(this.planets.length === 0){
      x = gen();
      y = gen();
    }

    while (this.planets.length > 0 && d < spacing){
      x = gen();
      y = gen();
      this.planets.each(function(p){
        var dx = Math.abs(p.get('x') - x);
        var dy = Math.abs(p.get('y') - y);
        d = Math.sqrt((dx*dx) + (dy*dy));
      });
    }

    var planet = new App.Models.Planet({
      x:x,
      y:y,
      name: 'Planet ' + String(Number(this.planets.length + 1)),
      system: this
    });
    this.planets.add(planet);
  }
});
