
#include "libsshpp.hpp"

int main() {
    ssh::Session session;
    session.setOption(SSH_OPTIONS_HOST, "localhost");
    session.setOption(SSH_OPTIONS_USER, "lincoln");
    session.userauthPassword("nothing");
    session.connect();
    return 0;
}
