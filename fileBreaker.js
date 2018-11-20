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
 
var IMAGE_FILENAME = 'pic.jpg';
var fsImage = fss(IMAGE_FILENAME);


var dgram = require('dgram');

var client = dgram.createSocket('udp4');

fsImage
    //blockSize default : 204800 byte (200kb)
    .avgSliceAsFile({blockSize: 400})
    .then(function (files) {
        console.info('##############', IMAGE_FILENAME, 'size: ', fs.statSync(IMAGE_FILENAME).size);
        console.info('############## files: \n', files);
        console.info('##############');
        var j=0
        for(let file of files){
            console.info(file, 'size: ',fs.statSync(file).size);
			
			var PORT = 3333;
			var HOST = '10.102.167.182';

			var dgram = require('dgram');
			

			
			
            fs.readFile(file, 'utf8' , function(err, data) {
                if (err) {
                    return console.log(err);
                }
                var client = dgram.createSocket('udp4');
                
                var jsonfile =  {message:"This is from the pic file", data: data,segment_number: j };
                console.log(jsonfile);
                var message = Buffer.from(JSON.stringify(jsonfile))
                client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
                    if (err) console.log(err);
                    console.log('UDP message sent to ' + HOST + ":" + PORT);
                    client.close();
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

	
	
client.close();



