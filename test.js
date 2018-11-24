var array = []
array[1] = 'Hello'
console.log(array[0] == undefined);

let cue = 'The actors are here!';
let cue2 = 'The actors are here again!'
// However, the cue is not announced until at least 5000ms have
// passed through the use of setTimeout
function helloWorld(cue, cue2) {
    console.log(cue + " " + cue2);

}

setTimeout(helloWorld,2000,cue2, cue);

// This console log is executed right away
console.log('An exploration of art and music. And now, as we wait for the actors...');  