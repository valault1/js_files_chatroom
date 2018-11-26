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
var windowStart = 1;
var packets_received;
var packets_toSend =['UNINITIALIZED']; //contains the packets of data in file form.
var acksReceived; //an integer containing the highest ack we have received
var ackToSend = 0;
var PORT = 3333;
var HOST = '127.0.0.1';
var timer;
var timeout = 1000;
var busy = false;
var packet_sent_already

var client = dgram.createSocket('udp4');
client.bind(PORT);







function sendHandshakeInit(fileName, fileType, port, host) {
    var handshake;
    console.log("Splitting file...");
    var fsImage = fss(fileName);
        fsImage.avgSliceAsFile({blockSize: 200})
        .then(function (files) {
        handshake = {packetType: 'handshakeInit', fileName: fileName, fileType: fileType, numSegments:files.length};
        handshake = Buffer.from(JSON.stringify(handshake));
        packets_toSend = new Array(files.length);
        var i = 0;
        console.log("files: " + files);

        for (let file of files) {
            data = fs.readFileSync(file) ;
            var packet =    {
            packetType: 'data', 
            fileType: fileType, 
            fileName: fileName,
            numSegments: files.length, 
            segmentNumber: i+1,
            data: Buffer.from(data)
            };
            
            packets_toSend[i] = Buffer.from(JSON.stringify(packet));
            i+=1;
        }

       

    }).then(function(files) {
        //Now, packets_toSend is populated, and the handshakeInit can send.
        console.log("This should happen at the very end.");
        console.log("sending handshake...");
        client.send(handshake, 0, handshake.length, port, host, function(err, bytes) {
            console.log("Sent handshake: " + handshake.toString());
            //client.close();
        });

    }).catch(function (err) {
        console.error(err);
    });
    

    
}


function sendHandshakeAck(message, remote) {
    //message is already a JSON
    if (!busy) {
        var handshakeAck = {packetType : 'handshakeAck', fileName: message.fileName, numSegments: message.numSegments};
        handshakeAck = Buffer.from(JSON.stringify(handshakeAck));
        client.send(handshakeAck, 0, handshakeAck.length, remote.port, remote.host, function(err, bytes) {
            if (err) throw err;
            console.log('UDP handshake ack sent to ' + HOST + ":" + PORT);
        });
        busy = true;
    }
    else {
        console.log("Sorry, it's busy");
    }
}

function reassembleFile(packets_received) {
    console.log("We got the whole file!");
    var data = new Buffer();
    for (let packet of packets_received) {
        data = Buffer.concat[data, packet.data];
    }
    print(data.toString());

    fs.writeFile("test/temp/" + packets_received[0].fileName, data, function(err) {
        if(err) {
            return console.log(err);
        }
    
        console.log("The file was saved!");
    }); 
    //store file
}


//args: timedout is a boolean, indicating if this was triggered by a timeout.
function sendWindow(timedout, remote) {
    //remote is the people who sent us the handshake ack
    //if this was a timeout, then we want to increase the timer time
    /*if (timedout && timedout < 5000) {
        timeout += 1000;
    }*/

    if (windowStart == packets_toSend.length+1) {
        console.log("received all acks! closing...");
        return;
    }
    console.log("NOW SENDING WINDOW");
    //cancel any old timers that may be running.
    clearTimeout(timer);
    //resend the packets in the window
    for (i = windowStart-1; i < windowStart+N-1 && i < packets_toSend.length; i++) {
        
        client.send(packets_toSend[i], 0, packets_toSend[i].length, remote.port, remote.address, function(err, bytes) {
            console.log("Sent packet to " +  remote.address + ":" + remote.port);
        }); //send packet number i
    }
    //set a timer, to call this function again if we don't 
    //timer = setTimeout(sendWindow, timeout, true, remote);
    
}
client.on('listening', function() {
    var address = client.address('udp4');
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
    
  });


//#######################################################################################################################
//#######################################################################################################################
client.on('message', function(message, remote) {
    message = JSON.parse(message.toString());
    console.log("received packet from " + remote.address + ':' + remote.port + ': ' + JSON.stringify(message));
    //RECEIVED HANDSHAKE INIT:
    if (message.packetType == 'handshakeInit') {
        packets_received = new Array(message.numSegments);
        sendHandshakeAck(message, remote);
        

    }
    
    //RECEIVED HANDSHAKE ACK
    if (message.packetType == 'handshakeAck') {
        //start Go-Back-N
        //acks_received = null;//we're pretty sure this is unnecessary
        windowStart = 1;
        sendWindow(false, remote);
    }  

    
    //RECEIVED DATA
    if (message.packetType == 'data') {
        //send an acknowledgement, add it to our packets_received
        console.log("we received a data packet");
        //if it's the right packet, increment the ackToSend
        if (message.segmentNumber == ackToSend + 1) {
            ackToSend = message.segmentNumber;
            packets_received[message.segmentNumber-1] = message;
            
        }
        var ack = {packetType: "dataAck", fileName: message.fileName, numSegments: message.numSegments, ackNumber: ackToSend};
        ack = Buffer.from(JSON.stringify(ack));

        //if we have all packets, reassemble te file
        if (ackToSend == message.numSegments) {
            reassembleFile(packets_received);
            busy = false;
        }
        client.send(ack, 0, ack.length, remote.port, remote.host, function(err, bytes) {
            console.log("sent an ack");
        });

        //update app to show progress of file recieved
        //pass the html: ack/message.segmentNumber

    }

    //RECEIVED PACKET ACK
    if (message.packetType == 'dataAck') {
    //add it to the acks received; adjust window
        console.log("Busy = " + busy);
        /*if (busy != true) {
            return;
        }*/
         if (message.ackNumber == message.numSegments) {
            //all acks have been received; stop the timer and stop
            console.log("We got all acks - file successfully sent!");
            busy = false;
            clearTimeout(timer);
        } else if (message.ackNumber == windowStart) {
            //Now we must adjust the window
            windowStart = windowStart+1;
            console.log("Window now starts at " + windowStart);
            //send the next packet
            //sendWindow(false, remote);
            if (windowStart + N - 2 < packets_toSend.length) {
                console.log("sending packet "  + (windowStart + N - 1));
                client.send(packets_toSend[windowStart + N - 2], 0, packets_toSend[windowStart + N - 2].length, remote.port, remote.address, function(err, bytes) {
                    console.log("Sent packet to " +  remote.address + ":" + remote.port);
                });
                clearTimeout(timer);
                console.log("Setting another timer, cleared Timeout...");
                timer = setTimeout(sendWindow, timeout, true, remote);
            }
            //update app to show progress of file recieved
        }
    }
});

sendHandshakeInit(FILENAME, 'image', 3334, HOST);


/*
JSON OBJECTS
Handshake init
{
    packetType: 'handshakeInit'
    filetype: (text, file, or image),
    fileName:
    numSegments:,

}
Handshake ack
{
    packetType:'handshakeAck'
    fileName:
    numSegments: 
    
}

Packet send
{
    packetType:  'data'
    filetype: (text, file, or image),
    fileName:
    numSegments: 10,
    segmentNumber: 
    
}

packet ack
{
    packetType:'dataAck'
    fileName:
    numSegments
    ackNumber: 
}



*/



  