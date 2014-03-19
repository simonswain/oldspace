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

var Planet = module.exports = Backbone.Model.extend({
  defaults: { 
    'name':'Unknown Planet', 
    'age': 0,
    'interval': 1000,
    'x':null,
    'y':null,
    size: 100,
    resource: 0,
    credit: 0,
    pop: 0,
    tech: 1
  },
  initialize: function(vals, opts) {
    _.bindAll(this, 'run','stop');

    this.set({
      id: uuid.v4(),
      interval: 1000 + random.from0to(5000),
      pop: 1000 * random.from1to(10),
      size: 1000 * random.from1to(10),
      credit: 0,
      resource: 1000000 * random.from1to(10)
    });

    this.system = opts.system;
    this.empire = null;

    this.ships = new App.Collections.Ships();

    this.shopcost = 25;
    
    this.timer = false;

    console.log(' - ' + this.system.get('name') + ':' + this.get('name'));

    this.run();
  },
  run: function(){
    if (  this.system.empire ){
    console.log(this.system.get('name') + ':' + this.get('id') + ' ' + this.get('name') + '>' + this.system.empire.get('name') + ' - credit: ', this.get('credit'));
    }
2
    //JSON.stringify(this.toJSON())
    if(this.system.empire && this.get('credit') > this.shopcost){
      this.spawnShip();
    }

    // calculate earnings from planet
    var earnings = random.from0to(5);

    this.set({
      age: this.get('age') + 1,
      credit: this.get('credit') + earnings
    });


    this.timer = setTimeout(this.run, this.get('interval'));
  },
  spawnShip: function(){

    var x, y;
    
    x = random.from0upto(this.system.get('radius'));
    y = random.from0upto(this.system.get('radius'));

    // calculate desired ship
    var shipcost = this.shopcost;

    this.set({
      credit: this.get('credit') - shipcost
    });

    console.log(' @ Spawn ' + this.system.get('name') + ':' + this.get('name') + ':' + this.system.empire.get('name'));

    var ship = new App.Models.Ship({
      x:this.get('x'),
      y:this.get('y')
    }, {
      empire: this.system.empire,
      planet: this
    })

    this.ships.add(ship);
    this.system.ships.add(ship);
    this.system.empire.ships.add(ship);

    console.log(this.system.empire.ships.length);

  },
  stop: function(){
  }
});

