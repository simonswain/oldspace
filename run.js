"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var random = require('random-to');

var App;
App = {
  Models: require('./models'),
  Collections: require('./collections')
};

var Universe = Backbone.Model.extend({
  defaults: {
    radius: 25,
  },

  initialize: function(){
    _.bindAll(this, 'addSystem','initSystems','render','renderSystems');

    this.empireCount = random.from1to(3);
    this.empires = new App.Collections.Empires([]);
    this.initEmpires();

    //this.systemCount = this.empires.length;
    this.systemCount = this.empires.length + 5 + random.from1to(5);
    
    this.systems = new App.Collections.Systems([]);
    this.initSystems();

    this.assignHomes();

    this.listenTo(this.systems, 'change', function(e){
      console.log('change');
    });
    

    //this.makeG();
    //this.render();

    console.log('=== Universe has ' + this.empires.length + ' Empires');
    console.log('                 ' + this.systems.length + ' Systems');
    console.log('                 ' + this.systems.reduce(function(a, system){
      a = a + system.planets.length;
      return a;
    }, 0) + ' Planets');

  },

  render: function(){
    return;
    process.stdout.write('\u001B[2J\u001B[0;0f');
    this.renderSystems();
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
      console.log( ' * ' + system.get('name'))
      system.planets.each(function(planet){
        console.log( '   . ' + planet.get('name') + '   cr ' + planet.get('credit'), JSON.stringify(planet.toJSON()))
      });

      system.ships.each(function(ship){
        console.log( '   > ' + ship.empire.get('name'), JSON.stringify(ship.toJSON()))
      });

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

  assignHomes: function(){

    for(var i = 0, ii = this.empires.length; i<ii; i++){
      this.empires.at(i).addSystem(this.systems.at(i));
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
    while(this.systems.length < this.systemCount){
      this.addSystem();
    }
  },

  addSystem: function(){

    var x, y;
    
    x = random.from0upto(this.get('radius') * 0.8) + (this.get('radius') * 0.1);
    y = random.from0upto(this.get('radius') * 0.8) + (this.get('radius') * 0.1);

    var system = new App.Models.System({
      x:x,
      y:y,
      name: 'System ' + String(Number(this.systems.length + 1))
    });
    this.systems.add(system);

  },
});

var universe = new Universe();

var server = require('./server')(universe);
