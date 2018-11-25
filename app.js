var PORT = 3333;
var newPORT = PORT;
var HudsonHOST = '192.168.1.93';
var HOST = '10.102.92.65';
var _ = require('lodash'); 
var dgram = require("dgram");
var ipAddress = [];

// function newPort(){
//   console.log('starting new port');
//   newPort++;
//   var newServer = dgram.createSocket('udp4');
//
//   newServer.on('listening', function() {
//     var address = server.address('udp4');
//     console.log('UDP Server listening on ' + address.address + ":" + address.port);
//
//   });
//
//   newServer.on('message', function(message,remote){
//     console.log('New Port on' + newPort);
//     console.log(remote.address + ':' + remote.port + ' - ' + message);
//
//   });
//
//
// }

function startServer(port,host){

var server = dgram.createSocket('udp4');

server.on('listening', function() {
  var address = server.address('udp4');
  console.log('UDP Server listening on ' + address.address + ":" + address.port);

});

server.on('message', function(message, remote) {
  console.log(server);
//console.log(remote.address + ':' + remote.port + ' - ' + JSON.parse(message.toString()).message);
console.log(remote.address + ':' + remote.port + ' - ' + message);
if (ipAddress == [] || ipAddress.find(remote.address)!) {
  ipAddress.append(remote.address)
  startServer(newPORT,remote.address);

}
else {
  var client = dgram.createSocket('udp4');
  client.

}

//console.log('making new port');


});

server.bind(port, host);
}

startServer(3333,'192.168.1.93');







// //Going to need this
// var PORT = 3333;
// var HOST = '10.102.167.182';
//
// var dgram = require('dgram');
// var message = new Buffer("Val says hi");
//
// var client = dgram.createSocket('udp4');
// client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//   if (err) throw err;
//   console.log('UDP message sent to ' + HOST + ":" + PORT);
//   client.close();
//
// });
