
var http = require('http');
var config = require('./config.json');


exports.start = start; 

// pre load the index file
var index_html = fs.readFileSync('./static/index.html', 'utf8');
var index_size = Buffer.byteLength(index_html);

function serve_handle(request, response) {
    if(request.method == 'GET' && request.url == '/') {
        // write the index page
        response.writeHead(200, {
            'Content-Length': index_size,
            'Content-Type': 'text/html' }); 
        response.write(index_html);
        response.end();
    }
};

function start() {
    http.createServer(serve_handle).listen(config.web_port, config.web_host);
}
