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
    ships: {
      el: $('.ships'),
    },
    map: {
      el: $('.map'),
      w: $('.map').width(),
      h: $('.map').height()
    },
    orbits: {
      el: $('.orbits'),
      w: $('.orbits').width(),
      h: $('.orbits').height()
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

  Views.map.el.html('<canvas id="map" width="' + Views.map.w + '" height="' + Views.map.h + '" />');
  Views.map.ctx = document.getElementById("map").getContext("2d");

  Views.orbits.el.html('<canvas id="orbits" width="' + Views.orbits.w + '" height="' + Views.orbits.h + '" />');
  Views.orbits.ctx = document.getElementById("orbits").getContext("2d");


  var Render = {};

  Render.map = function(){

    var maxRadius = 1000;

    var cradius = 08;
    var ctx = {};
     ctx.map = Views.map.ctx;
     ctx.orbits = Views.orbits.ctx;

    var w = Views.map.w;
    var h = Views.map.h;

    //ctx.map.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.map.clearRect(0, 0, w, h);

    ctx.orbits.fillStyle = "rgba(0, 0, 0, .25)";
    ctx.orbits.fillRect(0, 0, w, h);

    var rx = Views.map.el.width();
    var ry = Views.map.el.height();

    this.scalex = (rx / Space.universe.radius);
    this.scaley = (ry / Space.universe.radius);

    _.each(Space.systems, function(system){

      var x = system.x * this.scalex;
      var y = system.y * this.scaley;
      var radius = (cradius / maxRadius) * system.radius;

      var localX = function(v){
        // system x to ctx x
        return x + ((radius / system.radius) * v);
       };

      var localY = function(v){
        // system y to ctx y
        return y + ((radius / system.radius) * v);
      };

      // draw system size
      ctx.map.beginPath();
      ctx.map.arc(x + radius/2, y+radius/2, radius/2, 0, 2 * Math.PI, false);
      ctx.map.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.map.stroke();
      //ctx.map.fillStyle = 'rgba(51, 51, 51, 0.5)';
      //ctx.map.fill();

      // ctx.map.rect(x, y, radius, radius);
      // ctx.map.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      // ctx.map.stroke();



      _.each(system.planets, function(planet){
        ctx.map.beginPath();
        ctx.map.arc(localX(planet.x), localY(planet.y), 4, 0, 2 * Math.PI, false);
        ctx.map.fillStyle = '#fff';
        ctx.map.fill();
      });

      _.each(system.ships, function(ship){
        ctx.orbits.beginPath();
        ctx.orbits.arc(localX(ship.x), localY(ship.y), 2, 0, 2 * Math.PI, false);
        ctx.orbits.fillStyle = '#c00';
        ctx.orbits.fill();
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

  //setInterval(Render.systems, 1000);


  Render.empires = function(){

    var template = _.template('<td><%= name %></td>\
<td class="empireShips"><%= ships.length %></td>');

    var shipTpl = _.template('<tr>\
<td><%= name %></td>\
<td><%= x.toFixed(2) %></td>\
<td><%= y.toFixed(2) %></td>\
</tr>');

    Views.empires.el.html('');

    _.each(Space.empires, function(empire){

      var el = $('<tr class="" />').appendTo($(Views.empires.el));
      el.html(template(empire));

      var pel = $('<table />').appendTo(el.find('.empireShips'));

      _.each(empire.ships, function(ship){
        pel.append(shipTpl(ship));
      });

    });
  };

  //setInterval(Render.empires, 1000);


});
