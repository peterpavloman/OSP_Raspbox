
var config = require('.config.js');
var fs = require('graceful-fs');
var crypto = require('crypto');
var monitor = require('./monitor.js');
var net = require('net');

// get hash of file


function file_transfer(header, file_path) {
    var client = net.connect({port:config.sync_port, host:config.sync_address},
            function() {

            });
}

function file_new(path, stats) { 
   // file new
   // new file sha
    if(stats.isFile()) {
        file = fs.ReadStream(path);
        var shasum = crypto.createHash('sha1');
        file.on('data', function(d) {
            shasum.update(d);
        });
        file.on('end', function() {
            console.log(path);
            console.log(shasum.digest());
        });
    }
}

function file_deleted() {
    // f_d
    // file name
    // old sha
}

function file_changed() {
    // f_c
    // file name
    // old sha
    // new sha
    // file contents
}


function dir_new() {
    // d_n
}

function dir_deleted() {
    // d_d
}

function scan_dir() {
}

// register with the server
//client.connect(config.server, config.sync_port, connected);

// watch for changes and perform an rsync as nec

// resond to requests from server requests
//

monitor.walk_dir('/home/lincoln/tmp', file_new);
