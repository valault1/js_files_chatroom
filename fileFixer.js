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
  //two cases: receive a file, or receive an image
  var packets_received = new Array(message.numSegments)
  if (message.type == 'file') {
    console.log("received the header message, file has " + message.numSegments + " segments.");
    var socket = dgram.createSocket('udp4');
    socket.bind(PORT+1, HOST);

    socket.on('message', function(fileMessage, fileRemote) {
      packets_received[fileMessage.segmentNumber] = fileMessage
      console.log("received packet #" + fileMessage.segmentNumber)
      //TODO acknowledge it
    });
    function all_packets(packets_received) {
      for (i = 0; i < packets_received.length; i++) {
        if packets_received[i] == undefined {
          return false;
        }
      }
      return true;
    }
    setTimeout(function() {
      socket.close()
      if all_packets(packets_receieved) {
        console.log("All packets received! closing socket.");
      }
      else {
        console.log("Didn't get them all...destroying new socket");
        )
      }

    }, 10000); //10 second delay, for now

  }
});

server.bind(PORT, HOST);


//first we need a method that does a handshake type thing - 
//it receives a message saying "I have a message for you", and the number of segments
//
