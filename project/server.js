
// load config
var config = require('./config.json');
var http = require('http');
var fs = require('graceful-fs');
var monitor = require('./monitor.js');



function print_stat(path, stats) {
    if(stats.isDirectory()) {
        console.log("is a directory: ".concat(path));
    }
    if(stats.isFile()) {
        console.log("is a file: ".concat(path));
    }
}

function handle_change(event, filename) {
    console.log(event.concat(filename));
}

function watch_dirs(path, stats) {
    if(stats.isDirectory()) {
        fs.watch(path, handle_change);
    }
}
// start web server on port
monitor.walk_dir(config.config.path, print_stat);

