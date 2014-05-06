"use strict"

var _ = require('underscore')._;
var Backbone = require('backbone');

var cls = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

var App;
App = {
  Models: require('./models'),
  Collections: require('./collections')
};

var planet = new App.Models.Planet();

var fields = ['size','age','pop','pollution', 'tech','credit','agriculture']

var space = '            ';

var print = function(){
  cls();
  _.each(fields, function(x){
    console.log(x + space.substr(0, space.length - x.length) + ': ' + planet.get(x));
  });
  //console.log(JSON.stringify(planet.toJSON()));
}

setInterval(print, 1000);
