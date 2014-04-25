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

var system = new App.Models.System();

var print = function(){
  cls();
  system.planets.each(function(x){
    console.log(JSON.stringify(x.toJSON()));
  });
}
setInterval(print, 1000);
