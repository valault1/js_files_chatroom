var file = "Hello"
var File = require('File')
var FileReader = require('FileReader')
var FileList = require('FileList')


/*var fl=new FileList();
fl.readDir();
console.log("Reading file...")
var f = new File(["text"], "textfile.txt")
readfile(f)
function readFile(file) {
    var reader = new FileReader();
    reader.onload = function (evt) {
        var textContents = evt.target.result;
        console.log(textContents);
    };
    reader.readAsText(file);
}
var fs = require("fs");

// Asynchronous read
fs.readFile('textfile.txt', function (err, data) {
   if (err) {
      return console.error(err);
   }
   console.log("Asynchronous read: " + data.toString());
});

// Synchronous read
var data = fs.readFileSync('textfile.txt');
console.log("Synchronous read: " + data.toString());

console.log("Program Ended"); */
var fss = require('fs-slice');
var fs = require('fs');
 
var FILENAME = 'textfile3.txt';
var fsImage = fss(FILENAME);


var dgram = require('dgram');


fsImage
    //blockSize default : 204800 byte (200kb)
    .avgSliceAsFile({blockSize: 100})
    .then(function (files) {
        //First, send the header message
        var PORT = 3333;
		var HOST = '127.0.0.1';
		var dgram = require('dgram');
        var client1 = dgram.createSocket('udp4');
        client1.bind(PORT)
        console.log("attempting to send header...");
        headerJSON = {type:'file', numSegments: files.length};
        header = Buffer.from(JSON.stringify(headerJSON));
        client1.send(header, 0, header.length, PORT, HOST, function(err, bytes) {
            if (err) console.log(err);
            console.log("\nSent the header message " + header + "\n");
            client1.close();
        });
        


        console.info('##############', FILENAME, 'size: ', fs.statSync(FILENAME).size);
        console.info('############## files: \n', files);
        console.info('##############');
        var j=0;
        for(let file of files){
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

              
        }

        for(let file of files){
            fs.unlinkSync(file);    
        }
        
        
    })
    .catch(function (err) {
        console.error(err);
    });

	
	




