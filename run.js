"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');

var cls = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

var App;
App = {
  Models: require('./models'),
  Collections: require('./collections')
};

var Universe = Backbone.Model.extend({
  defaults: {
    radius: 256,
  },

  initialize: function(){
    _.bindAll(this, 'addSystem','initSystems','render','renderSystems');

    this.empireCount = random.from1to(3);
    this.empires = new App.Collections.Empires([]);
    this.initEmpires();

    this.systemCount = this.empires.length + 5 + random.from1to(5);
    //this.systemCount = this.empires.length;
    
    this.systems = new App.Collections.Systems([]);
    this.initSystems();

    //this.makeG();
    this.render();

    console.log('=== Universe has ' + this.empires.length + ' Empires');
    console.log('                 ' + this.systems.length + ' Systems');
    console.log('                 ' + this.systems.reduce(function(a, system){
      a = a + system.planets.length;
      return a;
    }, 0) + ' Planets');

  },

  render: function(){
    cls();
    //this.renderSystems();
    console.log(new Date());

    console.log('=== Universe has ' + this.empires.length + ' Empires');
    console.log('                 ' + this.systems.length + ' Systems');
    console.log('                 ' + this.systems.reduce(function(a, system){
      a = a + system.planets.length;
      return a;
    }, 0) + ' Planets');

    console.log('                 ' + this.empires.reduce(function(a, empire){
      a = a + empire.ships.length;
      return a;
    }, 0) + ' Ships');

    console.log();
    this.empires.each(function(empire){
      console.log( ' * ' + empire.get('name'))
    });

    console.log();
    this.systems.each(function(system){
      console.log( ' * ' + system.get('name') + '   ' + JSON.stringify(system.toJSON()))
      system.planets.each(function(planet){
        console.log( '   . ' + planet.get('name') + '   ships ' + planet.ships.length, JSON.stringify(planet.toJSON()))
      });

      // system.ships.each(function(ship){
      //   console.log( '   > ' + ship.empire.get('name'), JSON.stringify(ship.toJSON()))
      // });

    });

    console.log();
    setTimeout(this.render, 1000);

  },
  makeG: function(){
    var self = this;
    var x, xx, y, yy;

    this.G = [];

    for (x = 0, xx = this.get('radius'); x < xx; x = x + 1 ){
      this.G[x] = [];
      for (y = 0, yy = this.get('radius'); y < yy; y = y + 1 ){
        this.G[x][y]  = null;
      }
    }

    this.systems.each(function(system){
      var s = system.toJSON();
      console.log(s);
      self.G[s.x][s.y] = system;
    });

  },

  renderSystems: function(){
    var x, xx, y, yy, s;

    for (x = 0, xx = this.get('radius'); x < xx; x = x + 1 ){
      s = '';
      for (y = 0, yy = this.get('radius'); y < yy; y = y + 1 ){
        if(!this.G[x][y]) {
          s = s + '   ';
        } else {
          s = s + '(' +this.G[x][y].planets.length + ')';
        }
      }
      console.log(s);
    }
  },

  initEmpires: function(){
    while(this.empires.length < this.empireCount){
      this.addEmpire();
    }
  },

  addEmpire: function(){

    var empire = new App.Models.Empire({
      name: 'Empire ' + String(Number(this.empires.length + 1))
    });
    this.empires.add(empire);

  },

  initSystems: function(){
    // create system for each empire
    var self = this;
    this.empires.each( 
      function(empire){
        empire.addSystem(self.addSystem());
      });
    
    // create rest of systems
    while(this.systems.length < this.systemCount){
      this.addSystem();
    }
  },

  addSystem: function(){

    var self = this;

    var x, y;
    var d;
    var spacing = this.get('radius') * 0.3;

    var gen = function(){
      return Math.floor((self.get('radius') * 0.1) + random.from0upto(self.get('radius') * 0.8));
    };

    d = 0;

    if(this.systems.length === 0){
      x = gen();
      y = gen();
    }

    while (this.systems.length > 0 && d < spacing){
      x = gen();
      y = gen();
      this.systems.each(function(s){
        var dx = Math.abs(s.get('x') - x);
        var dy = Math.abs(s.get('y') - y);
        d = Math.sqrt((dx*dx) + (dy*dy));
        console.log(d);
      });
    }

    var system = new App.Models.System({
      x:x,
      y:y,
      name: 'System ' + String(Number(this.systems.length + 1))
    });
    this.systems.add(system);
    return system;
  },
});

var universe = new Universe();

var server = require('./server')(universe);

