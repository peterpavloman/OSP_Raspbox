
#include <sys/inotify.h>

#include <string>
#include <map>
#include <iostream>
#include <boost/filesystem.hpp>
#include <boost/iostreams/device/file_descriptor.hpp>

const int EVENT_SIZE = ( sizeof (struct inotify_event) );
const int MAX_NAME   = ( 255 );
const int MAX_EVENTS = ( 1024 );
const int BUF_LEN    = ( MAX_EVENTS * ( EVENT_SIZE + MAX_NAME + 1 ) );

const uint32_t WATCH_MASK = IN_CREATE;

using namespace boost;

/*!
 * @brief add a directory and sub directories to be watched
 *        
 */
void add_wd_dirs(std::string base_path, 
                 int fd, 
                 std::map<int, std::string> &wd_dirs) {
    
    

    boost::filesystem::path p(base_path);
    int wd = inotify_add_watch(fd, p.c_str(), WATCH_MASK );   
    wd_dirs[wd] = p.string();
    
    if(wd < 0) {
        std::cout << "Unable to watch base directory" << std::endl;
        return;
    }
   
    boost::filesystem::recursive_directory_iterator it(p);

    for(; it != boost::filesystem::recursive_directory_iterator(); ++it) {
        if(boost::filesystem::is_directory(*it)) {
            int new_wd = inotify_add_watch(fd, (*it).path().c_str(), WATCH_MASK);
            if(new_wd < 0) {
                std::cout << "Unable to watch dir " << (*it).path().c_str() << std::endl;
            }
            else {
                std::cout << "Adding " << (*it).path().native().c_str() << std::endl;
                wd_dirs[new_wd] = (*it).path().native();
            }
        }   
    }
    
}

void read_wd(int fd, std::map<int, std::string> &wd_dirs) {
    char buffer[BUF_LEN];
    iostreams::file_descriptor_source src(fd, iostreams::never_close_handle);
    
    while(true) {
        int read_size = src.read(buffer, BUF_LEN);
        int buffer_pos = 0;
        while(buffer_pos < read_size) {
            inotify_event *event = ( inotify_event * ) &buffer[buffer_pos];
            
            // handle event - perhaps do a thread for the event
            if(event->mask == IN_OPEN ) {
                std::cout << "mask in_open" << std::endl;
            }
            if(event->mask == IN_CREATE ) {
                std::cout << "mask in_create" << std::endl;
            }

            std::cout << event->mask << wd_dirs[event->wd] << event->name << std::endl;
            // moved to the end of read pos
            buffer_pos += EVENT_SIZE + event->len;
        }
    }
}

int main(int argc, char **argv) {
    std::string base_path = "/home/lincoln/Documents/University/2013/s2/osp/watch_dir/";
    int fd = inotify_init();
    std::map<int, std::string> wd_dirs;

    add_wd_dirs(base_path, fd, wd_dirs);
   
    read_wd(fd, wd_dirs);


    return 0;
}
