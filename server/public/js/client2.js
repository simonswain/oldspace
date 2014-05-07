var Space;

Space = {
  universe: null,
  systems: [],
  ships: [],
  empires: []
};

var App;
var Views;


var sock = new SockJS('http://localhost:9999/broadcast');

sock.onopen = function() {
};

sock.onmessage = function(e) {
  var data = JSON.parse(e.data);

  if(data.hasOwnProperty('universe')){
    Space.universe = data.universe;
  }

  if(data.hasOwnProperty('systems')){
    Space.systems = data.systems;
  }

  if(data.hasOwnProperty('empires')){
    Space.empires = data.empires;
  }

  if(data.hasOwnProperty('ships')){
    Space.ships = data.ships;
  }

};


sock.onclose = function() {
};


$(function(){

  Views = {
    map: {
      el: $('.map'),
    },
    jump: {
      el: $('.jump'),
    },
    systems: {
      el: $('<table />').appendTo('.data .systems')
    },
    empires: {
      el: $('<table />').appendTo('.data .empires')
    }
  };

  var Render = {};

  Render.map = function(){

    Views.map.el.html('');
    var r = Views.map.el.width();
    this.scale = (r / Space.universe.radius) * 0.8;
  
    var template = _.template('<span><%= name %></span>');

    _.each(Space.systems, function(system){
      var el = $('<div class="system" />')
        .appendTo($(Views.map.el))
        .css({
          left: system.x * this.scale,
          top: system.y * this.scale
        })

      el.html(template(system));

      var r = $(el).width();
      var scale = (r / system.radius) * 0.8;
      _.each(system.planets, function(planet){
        var pel = $('<div class="planet" />')
          .appendTo($(el))
          .css({
            left: planet.x * scale,
            top: planet.y * scale
          });

      });

      _.each(system.ships, function(ship){
        var sel = $('<div class="ship" />')
          .appendTo($(el))
          .css({
            left: ship.x * scale,
            top: ship.y * scale
          });
      });


    });
  };

  Render.jump = function(){

    var r = Views.jump.el.width();
    var scale = (r / Space.universe.radius) * 0.8;
    Views.jump.el.html('');
    _.each(Space.ships, function(ship){
      var el = $('<div />')
        .addClass('ship')
        .appendTo($(Views.jump.el))
        .css({
          left: ship.ux * scale,
          top: ship.uy * scale
        })

    });
  };


  setInterval(Render.map, 1000);
  //setInterval(Render.jump, 1000);


  Render.systems = function(){

    var template = _.template('<td><%= name %></td>\
<td class="planets"></td>');

    var planetTpl = _.template('<tr>\
<td><%= name %></td>\
<td class="credit">Cr <%= credit %></td>\
</tr>');

    Views.systems.el.html('');

    _.each(Space.systems, function(system){

      var el = $('<tr class="" />').appendTo($(Views.systems.el));
      el.html(template(system));


      var pel = $('<table />').appendTo(el.find('.planets'));
      _.each(system.planets, function(planet){
        pel.append(planetTpl(planet));
      });

    });
  };

  setInterval(Render.systems, 1000);


  Render.empires = function(){

    var template = _.template('<td><%= name %></td>\
<td class="ships"><%= ships.length %></td>');

    var shipTpl = _.template('<tr>\
<td><%= name %></td>\
<td><%= x.toFixed(2) %></td>\
<td><%= y.toFixed(2) %></td>\
</tr>');

    Views.empires.el.html('');

    _.each(Space.empires, function(empire){

      var el = $('<tr class="" />').appendTo($(Views.empires.el));
      el.html(template(empire));

      var pel = $('<table />').appendTo(el.find('.ships'));

      _.each(empire.ships, function(ship){
        pel.append(shipTpl(ship));
      });

    });
  };

  setInterval(Render.empires, 1000);


});
