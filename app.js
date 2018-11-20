var PORT = 3333;
var HudsonHOST = '10.102.167.182';
var HOST = '10.102.92.65';

var dgram = require("dgram");
var server = dgram.createSocket('udp4');

server.on('listening', function() {
  var address = server.address('udp4');
  console.log('UDP Server listening on ' + address.address + ":" + address.port);

});

server.on('message', function(message, remote) {
console.log(remote.address + ':' + remote.port + ' - ' + JSON.parse(message.toString()).message);

});

server.bind(PORT, HOST);
