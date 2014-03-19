var Space;

Space = {
  universe: null,
  systems: [],
  empires: []
};

var App;
var Views;


var sock = new SockJS('http://localhost:9999/broadcast');

sock.onopen = function() {
  console.log('open');
};

sock.onmessage = function(e) {
  var data = JSON.parse(e.data);
  
  if(data.hasOwnProperty('universe')){
    Space.universe = data.universe;
  }

  if(data.hasOwnProperty('universe')){
    Space.systems = data.systems;
  }

  if(data.hasOwnProperty('universe')){
    Space.empires = data.empires;
  }

};


sock.onclose = function() {
  console.log('close');
};


$(function(){

  Views = {
    map: {
      el: $('.map'),
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

    var r = Views.map.el.width();
    this.scale = (r / Space.universe.radius) * 0.8;

    var template = _.template('<span><%= name %></span>');

    Views.map.el.html('');
    
    _.each(Space.systems, function(system){

      var el = $('<div class="system" />')
        .appendTo($(Views.map.el))
        .css({
          left: system.x * scale,
          top: system.y * scale
        })

      el.html(template(system));    

      _.each(system.planets, function(planet){

        var r = $(el).width();

        var scale = (r / system.radius) * 0.8;

        var pel = $('<div class="planet" />')
          .appendTo($(el))
          .css({
            left: planet.x * scale,
            top: planet.y * scale
          });

      });        

    });    
  };

  setInterval(Render.map, 1000);


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
<td class="ships"></td>');

    var shipTpl = _.template('<tr>\
<td><%= name %></td>\
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
