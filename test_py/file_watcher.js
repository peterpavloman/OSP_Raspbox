
var fs = require('fs');

fs.watch('/home/lincoln/Documents/University/2013/s2/osp/test_dir', function (event, filename) {
    console.log(event);
    console.log(filename);
});
