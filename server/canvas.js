$(function(){
  var space = new DeepSpaceDataClient();
  var ui = new DeepSpaceUI(space);
});

var DeepSpaceDataClient = function(){

  var space, sock;

  space = {
    universe: null,
    systems: [],
    ships: [],
    empires: []
  };

  sock = new SockJS('http://localhost:9999/broadcast');

  sock.onopen = function() {
  };

  sock.onmessage = function(e) {
    var data = JSON.parse(e.data);

    if(data.hasOwnProperty('universe')){
      space.universe = data.universe;
    }

    if(data.hasOwnProperty('systems')){
      space.systems = data.systems;
    }

    if(data.hasOwnProperty('empires')){
      space.empires = data.empires;
    }

    if(data.hasOwnProperty('ships')){
      space.ships = data.ships;
    }
  };

  sock.onclose = function() {
  };

  return space;

}

var DeepSpaceUI = function(space){

  var views;

  views = {
    ships: {
      el: $('.ships')
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

  views.map.el.html('<canvas id="map" width="' + views.map.w + '" height="' + views.map.h + '" />');
  views.map.ctx = document.getElementById("map").getContext("2d");

  views.orbits.el.html('<canvas id="orbits" width="' + views.orbits.w + '" height="' + views.orbits.h + '" />');
  views.orbits.ctx = document.getElementById("orbits").getContext("2d");


  var render = {};

  render.map = function(){

    var maxRadius = 1000;

    var cradius = 64;
    var ctx = {};
    ctx.map = views.map.ctx;
    ctx.orbits = views.orbits.ctx;

    var w = views.map.w;
    var h = views.map.h;

    //ctx.map.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.map.clearRect(0, 0, w, h);

    ctx.orbits.fillStyle = "rgba(0, 0, 0, .25)";
    ctx.orbits.fillRect(0, 0, w, h);

    var rx = views.map.el.width();
    var ry = views.map.el.height();

    this.scalex = (rx / space.universe.radius);
    this.scaley = (ry / space.universe.radius);

    _.each(space.systems, function(system){

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
        ctx.map.fillStyle = '#090';
        ctx.map.fill();
      });

      _.each(system.ships, function(ship){
        var x = Number(ship.x);
        var y = Number(ship.y);
        ctx.orbits.beginPath();
        ctx.orbits.arc(localX(x), localY(y), 2, 0, 2 * Math.PI, false);
        ctx.orbits.fillStyle = '#f00';
        ctx.orbits.fill();
      });

    });
  };

  render.jump = function(){

    var r = views.jump.el.width();
    var scale = (r / space.universe.radius) * 0.8;
    views.jump.el.html('');
    _.each(space.ships, function(ship){
      var el = $('<div />')
        .addClass('ship')
        .appendTo($(views.jump.el))
        .css({
          left: ship.ux * scale,
          top: ship.uy * scale
        })

    });
  };


  setInterval(render.map, 100);

  render.systems = function(){

    var template = _.template('<td><%= name %></td>\
<td class="planets"></td>');

    var planetTpl = _.template('<tr>\
<td><%= name %></td>\
<td class="credit">Cr <%= credit %></td>\
</tr>');

    views.systems.el.html('');

    _.each(space.systems, function(system){

      var el = $('<tr class="" />').appendTo($(views.systems.el));
      el.html(template(system));


      var pel = $('<table />').appendTo(el.find('.planets'));
      _.each(system.planets, function(planet){
        pel.append(planetTpl(planet));
      });

    });
  };

  //setInterval(render.systems, 1000);


  render.empires = function(){

    var template = _.template('<td><%= name %></td>\
<td class="empireShips"><%= ships.length %></td>');

    var shipTpl = _.template('<tr>\
<td><%= name %></td>\
<td><%= x.toFixed(2) %></td>\
<td><%= y.toFixed(2) %></td>\
</tr>');

    views.empires.el.html('');

    _.each(space.empires, function(empire){

      var el = $('<tr class="" />').appendTo($(views.empires.el));
      el.html(template(empire));

      var pel = $('<table />').appendTo(el.find('.empireShips'));

      _.each(empire.ships, function(ship){
        pel.append(shipTpl(ship));
      });

    });
  };

  //setInterval(render.empires, 1000);

};
