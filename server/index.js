var http = require('http');
var sockjs = require('sockjs');
var node_static = require('node-static');

var _ = require('underscore');

// 1. Echo sockjs server
var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"};

// sockjs_echo.on('connection', function(conn) {
//   conn.on('data', function(message) {
//     conn.write(message);
//   });
// });

// 2. Static files server
var static_directory = new node_static.Server(__dirname + '/public');


module.exports = function(universe){

  var self = this;

  var sjs_broadcast = sockjs.createServer(sockjs_opts);
  var server = http.createServer();

  server.addListener('request', function(req, res) {
    static_directory.serve(req, res);
  });

  server.addListener('upgrade', function(req,res){
    res.end();
  });

  this.broadcast = {};
  var sjs_broadcast = sockjs.createServer(sockjs_opts);

  sjs_broadcast.on('connection', function(conn) {

    console.log('    [+] broadcast open ' + conn);
    self.broadcast[conn.id] = conn;

    var s = JSON.stringify(picture());
    conn.write(s);

    conn.on('close', function() {
      delete self.broadcast[conn.id];
      console.log('    [-] broadcast close' + conn);
    });

    conn.on('data', function(m) {
      console.log('    [-] broadcast message', m);
      for(var id in self.broadcast) {
        self.broadcast[id].write(m);
      }
    });

  });

  var picture = function(){
    
    var systems = universe.systems.map(function(x){
      var r = x.toJSON();
      r.planets = x.planets.toJSON();
      r.ships = x.ships.toJSON();
      return r;
    });

    var ships = [];
    var empires = universe.empires.map(function(x){
      var r = x.toJSON();
      r.ships = x.ships.toJSON();
      var x;
      ships = _.union(ships, _.filter(
        r.ships,
        function(x){
          return x.state === 'space'
        }));
      return r;
    });

    var data = {
      universe: universe.toJSON(),
      systems: systems,
      empires: empires,
      ships: ships
    };

    return data;

  };

  var announce = function(){
    var s = JSON.stringify(picture());
    
    for(var id in self.broadcast) {
      self.broadcast[id].write(s);
    }
  };

  sjs_broadcast.installHandlers(server, {prefix:'/broadcast'});

  universe.systems.on('change', function(){
    console.log('CHANGE');
  });

  setInterval(announce, 100);


  console.log(' [*] Listening on 0.0.0.0:9999' );
  server.listen(9999, '0.0.0.0');

};
