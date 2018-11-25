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
var acksReceived; //an integer containing the highest ack we have received
var ackToSend = 0;
var PORT = 3333;
var HOST = '127.0.0.1';

var client = dgram.createSocket('udp4');
client.bind(PORT);

//This happens when the user hits send
//var handshake = {}
//client.send(handshake);
//send them a handshake saying we have 10 packets





function sendHandshakeInit(fileName, fileType, host, port) {
    var fileList;
    var fsImage = fss(fileName);
    setImmediate(() => {
        fsImage.avgSliceAsFile({blockSize: 100})
        .then(function (files) {
            fileList = files;
            console.log("Changed fileList to the list of files we have.");
            console.log(fileList);
        });
      });
    
    console.log("Logging the filelist: " + fileList);
}


function sendHandshakeAck(message, remote) {
    var handshakeAck = {packetType : 'handshakeAck', numSegments: message.numSegments};
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
    message = JSON.parse(message.toString());
    console.log(remote.address + ':' + remote.port + ' - ' + JSON.parse(message.toString()).message);
    //RECEIVED HANDSHAKE INIT:
    if (message.packetType == 'handshakeInit') {
        //packets_received = new Array(message.numSegments);
        //sendHandshakeAck(message, remote);
    }
    
    //RECEIVED HANDSHAKE ACK
    if (message.packetType == 'handshakeAck') {
        //acks_received = null;
        //send 10 packets using GO-Back-N
    }  

    
    //RECEIVED PACKET DATA
    if (message.packetType == 'data') {
    //send an acknowledgement, add it to our packets_received
        //if message.segmentNumber = ackToSend + 1:
            //ackToSend = message.segmentNumber;
            //packets_received[message.segmentNumber-1] = message.data;
        //client.send(ackToSend);
    }

    //RECEIVED PACKET ACK
    if (message.packetType == 'dataAck') {
    //add it to the acks received; adjust window
        if (message.ackNumber == windowStart) {
            //Now we must adjust the window
            windowStart = windowstart+1;
            //send all N packets

        }
    }
});

sendHandshakeInit(FILENAME, 'text', HOST, PORT);
sendHandshakeInit(FILENAME, 'text', HOST, PORT);
console.log("finished the function");
client.close();
/*
JSON OBJECTS
Handshake init
{
    packetType: (handshakeInit, handshakeAck, data, dataAck)
    filetype: (text, file, or image),
    fileName:
    numSegments:,

}
Handshake ack
{
    packetType: (handshakeInit, handshakeAck, data, dataAck)
    fileName:
    numSegments: 
    
}

Packet send
{
    packetType: (handshakeInit, handshakeAck, data, dataAck)
    filetype: (text, file, or image),
    fileName:
    numSegments: 10,
    segmentNumber: 
    
}

packet ack
{
    packetType: (handshakeInit, handshakeAck, data, dataAck)
    fileName:
    ackNumber: 
}



*/



  