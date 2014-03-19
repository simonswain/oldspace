$(function(){

  Space = {
    universe: new App.Models.Universe(),
    systems: new App.Collections.Systems(),
    empires: new App.Collections.Empires()
  };

  Views = {
    map: new App.Views.Map({
      el: $('.map'),
      Space: Space
    }),
    systems: new App.Views.SystemsData({
      el: $('<table />').appendTo('.data .systems'),
      Space: Space
    }),
    empires: new App.Views.EmpiresData({
      el: $('<table />').appendTo('.data .empires'),
      Space: Space
    })


  };

});

var Space;
var App;
var Views;

Backbone.View.prototype.close = function(){
  this.stopListening();
  if (this.onClose){
    this.onClose();
  }
  this.remove();
};

var sock = new SockJS('http://localhost:9999/broadcast');

sock.onopen = function() {
  console.log('open');
};

sock.onmessage = function(e) {
  var data = JSON.parse(e.data);
  
  if(data.hasOwnProperty('universe')){
    Space.universe.set(data.universe);
  }

  if(data.hasOwnProperty('systems')){
    _.each(data.systems, function(x){
      if(Space.systems.get(x.id)){
        var t = Space.systems.get(x.id);
        t.set(x);
      } else {
        Space.systems.add([new App.Models.System(x)]);
      }
    });
  }

  if(data.hasOwnProperty('empires')){

    _.each(data.empires, function(x){
      if(Space.empires.get(x.id)){
        var t = Space.empires.get(x.id);
        t.set(x);
      } else {
        Space.empires.add([new App.Models.Empire(x)]);
      }
    });
  }

  //console.log('message', JSON.parse(e.data), e );
};


sock.onclose = function() {
  console.log('close');
};



///////////////////////

App = {
  Models: {},
  Collections: {},
  Views: {}
};


App.Models.Universe = Backbone.Model.extend({
  defaults: {
    radius: 25,
  },
  initialize: function(){
  }
});


App.Models.Ship = Backbone.Model.extend({
  defaults: { 
    id: null,
    name:'Unknown Ship', 
    x:null,
    y:null,
    vx: 0,
    vy: 0,
    a: 0, // angle
    v: 0, // velocity
    warp: 0, // warp drive range
    grav: 1, // grav drive power
    laser: 0, // laser power
    ramge: 0, // laser range
    missile: 0,
    energy_max: 0,
    energy: 0,
    recharge: 0,
    power: 0,
    damage: 0,
    shield: 0,
  },
  initialize: function(vals, opts) {
  }
});

App.Collections.Ships = Backbone.Collection.extend({
  model: App.Models.Ship,
  initialize: function(models, opts) {
  }
});


App.Models.Empire = Backbone.Model.extend({
  defaults: { 
    'id': null,
    'name':'Unknown Empire'
  },
  initialize: function(vals, opts) {
  }
});

App.Collections.Empires = Backbone.Collection.extend({
  model: App.Models.Empire,
  initialize: function(models, opts) {
  }
});


App.Models.Planet = Backbone.Model.extend({
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
  }
});


App.Models.System = Backbone.Model.extend({
  defaults: { 
    'id': null,
    'name':'Unknown System',
    'radius': 1000,
    'age': 0,
    'x':null,
    'y':null
  },
  initialize: function() {
    //_.bindAll(this, 'addPlanet','initPlanets');

    //this.planetCount = random.from1to(3);

    //this.planets = new App.Collections.Planets();
    //this.ships = new App.Collections.Ships();

    //this.initPlanets();

  // },
  // addPlanet: function(planet){
  //   var planet = new App.Models.Planet(planet);
  //   this.planets.add(planet);
  }
});

App.Collections.Systems = Backbone.Collection.extend({
  model: App.Models.System,
  initialize: function(models, opts) {
    //_.bindAll(this, 'url');
  }
});

////////////////////////

App.Views.Planet = Backbone.View.extend({
  template: _.template(''),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    // _.each(this.views, function(x){
    //   x.close();
    // });

    var data = this.model.toJSON();
    $(this.el).html(this.template(data));
    return this;
  }
});

App.Views.System = Backbone.View.extend({
  template: _.template('<span><%= name %></span>'),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.scale = opts.scale;

    var r = $(this.el).width();
    this.scale = (r / this.model.get('radius')) * 0.8;

    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });

    var data = this.model.toJSON();
    $(this.el).html(this.template(data));

    this.addAll();

    return this;
  },
  addAll: function(){
    var self = this;
    _.each(this.model.get('planets'), function(x){
      self.add(x);
    });
  },
  add: function(planet){
    var el = $('<div class="planet" />')
      .appendTo($(this.el))
    .css({
      left: planet.x * this.scale,
      top: planet.y * this.scale
    })
    // var planet = new App.Views.Planet({
    //   Space: this.Space,
    //   scale: this.scale,
    //   model: x,
    //   el: el
    // });
    // this.views.push(planet);
  }
});

App.Views.Map = Backbone.View.extend({
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.Space.systems,'change reset add remove', this.render);
    this.render();

    var r = $(this.el).width();
    var h = $(this.el).height();
    if (h < r) {
      r = h;
    }

    this.scale = r / this.Space.universe.get('radius');

    //console.log('......', r, this.Space.universe.get('radius'), this.scale);

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });
    $(this.el).html('');
    this.addAll();
    return this;
  },
  addAll: function(){
    var self = this;
    this.Space.systems.each(function(x){
      self.add(x);
    });
  },
  add: function(x){
    var el = $('<div class="system" />')
      .appendTo($(this.el))
    .css({
      left: x.get('x') * this.scale,
      top: x.get('y') * this.scale
    })
    var system = new App.Views.System({
      Space: this.Space,
      scale: this.scale,
      model: x,
      el: el
    });
    //this.views.push(system);
  }
});




////



App.Views.PlanetData = Backbone.View.extend({
  template: _.template('<tr><td><%= name %></td>\
<td class="credit">Cr <%= credit %></td>\
</tr>'),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    var data = this.model.toJSON();
    $(this.el).html(this.template(data));
    return this;
  }
});


App.Views.SystemData = Backbone.View.extend({
  template: _.template('<td><%= name %></td>\
<td class="planets"></td>\
'),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;

    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });

    var data = this.model.toJSON();
    $(this.el).html(this.template(data));

    this.addAll();

    return this;
  },
  addAll: function(){
    var self = this;
    _.each(this.model.get('planets'), function(x){
      self.add(x);
    });
  },
  add: function(planet){
    var model = new App.Models.Planet(planet);;

    var el = $('<table class="planet" />').appendTo($(this.el).find('.planets'));
    //$(el).html(planet.name);
                                            
    var planet = new App.Views.PlanetData({
      model: model,
      el: el
    });
    this.views.push(planet);
  }
});

App.Views.SystemsData = Backbone.View.extend({
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.Space.systems,'change reset add remove', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });
    $(this.el).html('');
    this.addAll();
    return this;
  },
  addAll: function(){
    var self = this;
    this.Space.systems.each(function(x){
      self.add(x);
    });
  },
  add: function(x){

    var el = $('<tr />').appendTo($(this.el));

    var system = new App.Views.SystemData({
      Space: this.Space,
      model: x,
      el: el
    });

    this.views.push(system);

  }
});



App.Views.ShipData = Backbone.View.extend({
  template: _.template('<tr><td><%= name %></td>\
</tr>'),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    var data = this.model.toJSON();
    $(this.el).html(this.template(data));
    return this;
  }
});



App.Views.EmpireData = Backbone.View.extend({
  template: _.template('<td><%= name %></td>\
<td class="ships"></td>\
'),
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;

    this.listenTo(this.model,'change', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });

    var data = this.model.toJSON();
    $(this.el).html(this.template(data));

    this.addAll();

    return this;
  },
  addAll: function(){
     var self = this;
     _.each(this.model.get('ships'), function(x){
       self.add(x);
     });
  },
  add: function(planet){
    var model = new App.Models.Ship(ship);

    var el = $('<table class="ship" />').appendTo($(this.el).find('.ships'));
    //$(el).html(ship.name);
                                            
    var ship = new App.Views.ShipData({
      model: model,
      el: el
    });
    this.views.push(ship);
  }
});


App.Views.EmpiresData = Backbone.View.extend({
  initialize : function(opts) {
    var self = this;
    _.bindAll(this, 'onClose', 'render','add','addAll');
    this.delegateEvents();
    this.views = [];
    this.Space = opts.Space;
    this.listenTo(this.Space.empires,'change reset add remove', this.render);
    this.render();

  },
  events: {
  },
  onClose: function(){
    var self = this;
    _.each(this.views, function(x){
      x.close();
    });
    this.stopListening();
  },
  render : function() {
    _.each(this.views, function(x){
      x.close();
    });
    $(this.el).html('');
    this.addAll();
    return this;
  },
  addAll: function(){
    var self = this;
    this.Space.empires.each(function(x){
      self.add(x);
    });
  },
  add: function(x){
    var el = $('<tr />').appendTo($(this.el));

    var empire = new App.Views.EmpireData({
      Space: this.Space,
      model: x,
      el: el
    });

    this.views.push(empire);

  }
});
