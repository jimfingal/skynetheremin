sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get install -y vim git ufw git-core curl build-essential openssl libssl-dev python g++ make checkinstall fakeroot libpcre3-dev software-properties-common supervisor

# From https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
src=$(mktemp -d) && cd $src
wget -N http://nodejs.org/dist/node-latest.tar.gz
tar xzvf node-latest.tar.gz && cd node-v*
./configure
fakeroot checkinstall -y --install=no --pkgversion $(echo $(pwd) | sed -n -re's/.+node-v(.+)$/\1/p') make -j$(($(nproc)+1)) install
sudo dpkg -i node_*


sudo useradd -d /home/node -s /bin/bash -m node

su - node
git clone https://github.com/jimmytheleaf/skynetheramin.git
cd skynetheramin
npm install
exit

# nginx
sudo add-apt-repository ppa:nginx/stable
sudo apt-get update

sudo cp /home/node/skynetheramin/skynet.nginx /etc/nginx/sites-available/skynet
cd /etc/nginx/sites-enabled/
rm ./default
ln -s ../sites-available/skynet skynet
/etc/init.d/nginx restart
