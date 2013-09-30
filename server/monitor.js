
var fs = require('graceful-fs');
var path = require('path');

// exported functions
exports.walk_dir = walk_dir;


function walk_dir(base_path, callback) {
    // if file gets passed throu as base_path, just call callback
    base_stats = fs.statSync(base_path);
    if(base_stats.isFile()) {
        callback(base_path, base_stats);
        return;
    }

    callback(base_path, base_stats);
    
    // handle files, recall walk_dir for any directories
    fs.readdir(base_path, function(err, files) {
        for(var i=0; i < files.length; i++) {

            result_path = path.join(base_path, files[i]);
            stats = fs.lstatSync(result_path);

            if(stats.isDirectory()) {
                walk_dir(result_path, callback);
            }
            else if(stats.isSymbolicLink()) {
            }
            else {
                callback(result_path, stats);
            }
        }
    });
}


