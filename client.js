var PORT = 3333;
var HOST = '10.102.167.182';

var dgram = require('dgram');
var message = new Buffer("Val says hi");

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST + ":" + PORT);
  client.close();

});
