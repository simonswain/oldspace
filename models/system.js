"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');

var App;
App = {
  Models: require('../models'),
  Collections: require('../collections')
};

var System = module.exports = Backbone.Model.extend({
  defaults: { 
    'id': null,
    'name':'Unknown',
    'radius': 1000,
    'age': 0,
    'x':null,
    'y':null
  },
  initialize: function() {
    _.bindAll(this, 'addPlanet','initPlanets');

    this.planetCount = random.from1to(3);

    this.planets = new App.Collections.Planets();
    this.ships = new App.Collections.Ships();

    this.initPlanets();
    console.log( ' * ' + this.get('name') + ' has ' + this.planets.length + ' planets')

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

