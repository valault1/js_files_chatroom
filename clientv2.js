var file = "Hello"
var File = require('File')
var FileReader = require('FileReader')
var FileList = require('FileList')
var fss = require('fs-slice');
var fs = require('fs');
var FILENAME = 'textfile3.txt';
var fsImage = fss(FILENAME);
var HOST1 = '127.0.0.1';
var dgram = require('dgram');
var N = 5;
var windowStart = 0;
var packets_received;
var acks_received;

var client = dgram.createSocket('udp4');
client.bind(PORT);

//This happens when the 
var handshake = {}
client.send(handshake);
//send them a handshake saying we have 10 packets


function setWindow(acks) {
    for (i=0; i < acks.length; i++) {
        if (acks[i] == undefined) {
            windowStart = i;
        }
    }
}

function sendHandshakeAck(message, remote) {
    var handshakeAck = {packetType : 'handshakeAck'};
    handshakeAck = Buffer.from(JSON.stringify(handshakeAck));
    client.send(handshakeAck, 0, handshakeAck.length, remote.port, remote.host, function(err, bytes) {
        if (err) throw err;
        console.log('UDP handshake ack sent to ' + HOST + ":" + PORT);
      
      });
}
/*

*/


client.on('listening', function() {
    var address = server.address('udp4');
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
  
  });


client.on('message', function(message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + JSON.parse(message.toString()).message);
    //HANDSHAKE INIT:
        //sendHandshakeAck(message, remote);
    
    //if message is a handshake acknowledgement, then send the 10 packets
        //send 10 packets using GO-Back-N


    
    //if message is a packet, send an acknowledgement, add it to our packets_received
        //packets_received[message.segmentNumber] = message.data;

    //if message is a packet ack, then add it to the acks received






    





}


/*
JSON OBJECTS
Handshake init
{
    packetType: (handshakeInit, handshakeAck, packetSend, packetAck)
    filetype: (text, file, or image),
    numSegments:,

}
Handshake ack
{
    packetType: (handshakeInit, handshakeAck, packetSend, packetAck)
    
}

Packet send
{
    packetType: (handshakeInit, handshakeAck, packetSend, packetAck)
    filetype: (text, file, or image),
    numSegments: 10,
    segmentNumber: 
    
}

packet ack
{
    packetType: (handshakeInit, handshakeAck, packetSend, packetAck)
    
}



*/



  