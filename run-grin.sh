#Start the daemon
./grin server -c grin-server.toml start

#change grin-wallet.toml
api_listen_interface = "0.0.0.0"


#Init wallet if it doesn't exist
./grin wallet -p TODO init

#First listen for rewards (think only required for mining)
./grin wallet --external listen

#For api access
./grin wallet --external owner_api


#terminal GUI 
./grin server -c grin-server.toml run






#Running wallet TODO


Colors
https://uigradients.com/#BlueRaspberry
https://uigradients.com/#Quepal
https://uigradients.com/#Reef
