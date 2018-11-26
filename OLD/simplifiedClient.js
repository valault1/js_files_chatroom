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
fsImage3.
    //blockSize default : 204800 byte (200kb)
    .avgSliceAsFile({blockSize: 100})
    .then(function (files) {
        //First, send the handshake
        var N = 5 //the size of the window
        var PORT = 3333;
		var HOST = '127.0.0.1';
		var dgram = require('dgram');
        var client = dgram.createSocket('udp4');
        client.bind(PORT, HOST)
        var acks = [];
        handshake = {type:'file', numSegments: files.length};

        console.log("attempting to send header...");
        handshake = Buffer.from(JSON.stringify(handshake));
        setInterval(client.send(handshake, 0, handshake.length, PORT+1, HOST, function(err, bytes) {
            if (err) console.log(err);
            console.log("\nSent the handshake message " + handshake.toString() + "\n");
            client.close();
            acks = new Array(files.length);
        }),1000);
        

        
        client.on('message', function(messageReceived, remote) {
            messageReceived = JSON.parse(messageReceived.toString());
            if (messageReceived.type == 'handshakeAck') {
                var j=0;
                /*for(let file of files){
                    console.info(file, 'size: ',fs.statSync(file).size);
                    fs.readFile(file, 'utf8' , function(err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        var client = dgram.createSocket('udp4');
                        var jsonfile =  {fileName:FILENAME, data: data,segmentNumber: j, type:"file", numSegments: files.length};
                        //console.log(jsonfile);
                        var message = Buffer.from(JSON.stringify(jsonfile))
                        client.on('message', function(fileMessage, remote) {
                            console.log("received an ack");
                            client.send(message, 0, message.length, 3334, HOST, setTimeout(function(err, bytes) {
                                if (err) console.log(err);
                                console.log('UDP message sent to ' + HOST + ":" + (PORT+1) +"; message:" + message);
                                
                                client.close();
                            }, 3000));
                        });
                        
                        j++;
                    });

                    
                }*/
                console.log(files[1]);
            }
            else if (messageReceived.type == 'fileAck') {
                acks[messageReceived.segmentNumber] = true;
            }
        });
        


        console.info('##############', FILENAME, 'size: ', fs.statSync(FILENAME).size);
        //console.info('############## files: \n', files);
        //console.info('##############');
        

        for(let file of files){
            fs.unlinkSync(file);    
        }
        
        
    })
    .catch(function (err) {
        console.error(err);
    });

	
	




