
var spawn = require('child_process').spawn;


function get_directory_list() {
    var csync_files = spawn('csync2', ['-L']);

    csync_files.stdout.on('data', function(data) {
        var arr = data.toString().trim().split(/[\t|\n]/);
        for(var i = 1; i < arr.length; i += 2) {
            if(arr[i-1].match(/type=dir/)) {
                console.log('dir');
            }
            else {
                console.log('file');
            }
            console.log(arr[i]);
        }
    });
}

function sync(config_name='', extra_options=[]) {
    var config_option = '';
    if(config_name != '') {
        config_option = '-C ' + config_name;
    }
    var csync_sync = spawn('csync2', [config_option, '-x']);
}


get_directory_list();

