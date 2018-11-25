var port = 3333;
var host = '192.168.1.93';
var sendToClient = '192.168.1.93';
var sendToPort = 3334;
var dgram = require("dgram");

function startServer(port,host) {
  var server = dgram.createSocket('udp4');

  server.on('listening', function() {
    var address = server.address('udp4');
    console.log('UDP server listening on ' + address.address + ':' + address.port);
  });

  server.on('message', function(message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
    var client = dgram.createSocket('udp4');
    var message = new Buffer('Hello World');
    client.send(message, 0, message.length, sendToPort, sendToClient, function(err, bytes) {
      if(err) throw err;
      console.log('UDP message sent to ' + sendToClient + ':' + sendToPort);
      client.close();
    });

  });

  server.bind(port, host);
};

startServer(port,host)


//client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//   if (err) throw err;
//   console.log('UDP message sent to ' + HOST + ":" + PORT);
//   client.close();
