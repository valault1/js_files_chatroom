var array = [1, 2, 3, 4]
array.forEachAsync(function (item, next) {
    // do some async task
    console.log(item + " started");
    setTimeout(function () {
        console.log(item + " done");
        next();
    }, 1000);
}, function () {
    console.log("All done!");
});