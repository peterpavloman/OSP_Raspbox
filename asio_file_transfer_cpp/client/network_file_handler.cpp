
#include "network_file_handler.h"
#include <fstream>
#include <vector>
#include <memory>
#include <functional>

network::NetworkFileHandler::NetworkFileHandler( 
        boost::asio::io_service &io_service)
: io_service_(io_service), socket_(io_service)
{
}

void network::NetworkFileHandler::send_file_handler(
        const boost::system::error_code& error,
        std::size_t bytes_transferred) 
{
    // Create buffer - should prob be a member
    std::shared_ptr<std::array<char, BUFFER_SIZE> > buffer( new std::array<char, BUFFER_SIZE> );
    // check for errors
    if(!error) {
        // check if the whole file is read or has been closed
        if(source_file_.eof() || !source_file_.is_open()) {
            std::cout << "close1" << std::endl;
            source_file_.close();
            return;
        }

        source_file_.seekg(bytes_transferred);
        source_file_.read(buffer->data(), BUFFER_SIZE);
        // continue sending file
        boost::asio::async_write(socket_, 
                boost::asio::buffer(buffer->data(), buffer->size()), 
                std::bind(&network::NetworkFileHandler::send_file_handler, 
                            shared_from_this(),
                            std::placeholders::_1,
                            bytes_transferred + source_file_.gcount()
                            ));
    }
}

void network::NetworkFileHandler::send_file(std::string file_name, 
                                            tcp::resolver::iterator endpoint_iterator) 
{   
    boost::asio::connect(socket_, endpoint_iterator);
    source_file_.open(file_name, std::ios_base::in | std::ios_base::binary);
    // write buffer to tcp stream
    boost::system::error_code ignored_ec;
    send_file_handler(ignored_ec, 0);
}

