
var http = require('http');
var url = require('url');
var config = require('./config.json');
var fs = require('fs');
var path = require('path');

exports.start = start; 

function parse_path(req_url) {
    var url_pathname = url.parse(req_url).pathname;
    if(url_pathname.indexOf('/files/') == 0) {
        return path.join(config.path, url_pathname.substring(6));
    }
    if(req_url.indexOf('/dirs/') == 0) {
        return path.join(config.path, req_url.substring(5));
    }
}

function get_file(request, response) {
    var full_path = parse_path(request.url);
    
    if(full_path.indexOf(config.path) != 0) {
        response.end();
        return;
    }
    
    // check if item exists
    if(!fs.existsSync(full_path)) {
        response.end();
        return;
    }
    
    // pipe file to response 
    var f = fs.ReadStream(full_path);
    f.pipe(response);
}

function new_file(request, response) {
    var new_hash = '';
    var full_path = parse_path(request.url);

    if(fs.exists(full_path)){
        response.end();
        return;
    }
   
    // open file and pipe data to it 
    var w_stream = fs.createWriteStream(full_path);
    request.on('end', function() {
        response.end();
    });
    request.pipe(w_stream);
}

function update_file(request, response) {
    var full_path = parse_path(request.url);

    // check hashes

    // overwrite file

}

function delete_file(request, response) {
    var full_path = parse_path(request.url);
    
    console.log(full_path);

    if(fs.existsSync(full_path)) {
        fs.unlink(full_path, function() {
            response.end();
        });
    }
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
        if(request.url.indexOf('/files/') == 0) {
            get_file(request, response);
            return;
        }
    }
    
    if(request.method == 'POST') {
        if(request.url.indexOf('/files/') == 0) {
            new_file(request, response);
            return;
        }
    }

    if(request.method == 'PUT') {
        if(request.url.indexOf('/files/') == 0) {
            update_file(request, response);
            return;
        }
    } 

    if(request.method == 'DELETE') {
        if(request.url.indexOf('/files/') == 0) {
            delete_file(request, response);
            return;
        }
    }

    response.end();
};

function start() {
    http.createServer(serve_handle).listen(config.sync_port, config.sync_host);
}

start();
