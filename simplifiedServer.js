var PORT1 = 3333;
var PORT2 = 3334;
var HudsonHOST = '10.102.167.182';
var HOST = '127.0.0.1';

var dgram = require("dgram");
var server = dgram.createSocket('udp4');
server.bind(PORT1, HOST);
server.on('listening', function() {
  var address = server.address('udp4');
  console.log('UDP Server listening on ' + address.address + ":" + address.port);

});

server.on('message', function(message, remote) {
  console.log(message.toString());
  message=JSON.parse(message.toString());
  console.log(remote.address + ':' + remote.port + ' - ' + message);
  //acknowledge
  var ack = Buffer.from("acknowledged");
  server.send(ack, 0, ack.length, PORT1, HOST, function() {

  });


  //two cases: receive a file, or receive an image
  var packets_received = new Array(message.numSegments)
  if (message.type == 'file') {
    console.log("received the header message, file has " + message.numSegments + " segments.");
    var socket = dgram.createSocket('udp4');
    
    console.log("Bound socket to " + PORT2);
    socket.on('listening', function() {
      var address = socket.address('udp4');
      console.log('UDP Socket listening on ' + address.address + ":" + address.port);
    
    });
    socket.on('message', function(fileMessage, fileRemote) {
      packets_received[fileMessage.segmentNumber] = fileMessage
      console.log("received packet #" + fileMessage.segmentNumber)
      if (fileMessage.segmentNumber == packets_received.length) {
        close();
      }
      //TODO acknowledge it
    });
    socket.bind(PORT2, HOST);
    function all_packets(packets_received) {
      for (i = 0; i < packets_received.length; i++) {
        if (packets_received[i] == undefined) {
          return false;
        }
      }
      return true;
    }
    function close(){
      socket.close()
      if (all_packets(packets_received)) {
        console.log("All packets received! closing socket.");
      }
      else {
        console.log("Didn't get them all...destroying new socket");
        
      }

    } 

  }
});




//first we need a method that does a handshake type thing - 
//it receives a message saying "I have a message for you", and the number of segments
//
