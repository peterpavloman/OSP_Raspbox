
var http = require('http');
var url = require('url');
var config = require('./config.json');
var fs = require('fs');

exports.start = start; 


function get_file(base_path, response) {
    
}

// POST - Create
// GET - Return
// PUT - Update
// DELETE - Delete
//
// url contains type and path
// dirs/test
// files/test
function serve_handle(request, response) {
    if(request.method == 'GET') {
        var req_url = url.parse(request.url);
        var f = fs.ReadStream(req_url.pathname);
        f.on('data', function(chunk) {
            console.log(chunk);
            response.write(chunk);
        });
        f.on('end', function() {
            response.end();
        });
    }
};

function start() {
    http.createServer(serve_handle).listen(config.sync_port, config.sync_host);
}

start();
