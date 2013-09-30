
#include <string>
#include <boost/asio.hpp>
#include <boost/array.hpp>
#include <iostream>
#include <fstream>

#include "network_file_handler.h"

using boost::asio::ip::tcp;

const std::string FILE_PATH = "/home/lincoln/test";
const std::string IP = "10.0.0.100";


int main() {
    try {
        boost::asio::io_service io_service;

        tcp::resolver resolver(io_service);
        tcp::resolver::query query(IP, "9999");
        tcp::resolver::iterator endpoint_iterator = resolver.resolve(query);
        network::network_file_handler_ptr nfh(new network::NetworkFileHandler(io_service));
        nfh->send_file(FILE_PATH, endpoint_iterator);
        io_service.run();
    }
    catch (std::exception& e) {
        std::cerr << e.what() << std::endl;
    }
    return 0;
}

