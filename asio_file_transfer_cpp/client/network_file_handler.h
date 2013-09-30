#ifndef _NETWORK_FILE_HANDLER_H_
#define _NETWORK_FILE_HANDLER_H_

#include <boost/asio.hpp>
#include <memory>
#include <string>
#include <fstream>
#include <array>

const int BUFFER_SIZE = 8192; // 8 KB 

using boost::asio::ip::tcp;

namespace network {

class NetworkFileHandler : public std::enable_shared_from_this<NetworkFileHandler> {
    private:
        boost::asio::io_service &io_service_;
        std::string file_name_;
        std::ifstream source_file_;
        std::array<char, BUFFER_SIZE> buffer_;
        int buffer_size_;
        tcp::socket socket_;
        void connect(); 

    public:
        NetworkFileHandler(boost::asio::io_service &io_service);
        
        /*!
         * @brief send a file to a client
         */
        void send_file(std::string file_name, tcp::resolver::iterator endpoint_iterator);

        /*!
         * @breif get a file from a client
         */
        //void read_file(std::string file_name);

        void send_file_handler(const boost::system::error_code& error,
                               std::size_t bytes_transferred);
};

typedef std::shared_ptr<NetworkFileHandler> network_file_handler_ptr;

} //  namespace network

#endif // _NETWORK_FILE_HANDLER_H_

