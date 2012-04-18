== Translation Game Installation ==
# Add node.js repository (on Debian/Ubuntu) and refresh package list
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update

# Install node.js server, node package manager, and redis-server for caching
sudo apt-get install nodejs npm redis-server

# Install necessary node packages
npm install jsdom
npm install connect
npm install connect-redis
npm install now

# Create servername.txt containing your domain name, put it in the root directory of your project
echo "localhost" > servername.txt

# Create etherpadapikey.txt containing its namesake
echo "YOUR_ETHERPAD_KEY" > etherpadapikey.txt

# Start redis
sudo /etc/init.d/redis-server start

# Start node.js server
node app.js

# Open a page
http://localhost:8080/?url=http://es.wikipedia.org/wiki/Ingles

