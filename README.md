#   Simple nodejs and angularjs 4 app

### Installation

Should be as simple as cloning this repo and doing a vagrant up

- The Vagrantfile installs docker on a ubuntu box and installs docker-compose
- docker-compose builds two containers one to serve the front end angular code and the other is the expressjs server
- Go to a browser @ localhost:4200

- Currently the expressjs server is only expossed to the angular app @ localhost:9090
- The expressjs server will be the link between saltstack, junos space, the telemetry data and the front end angular app

### If it goes poorly...

- After the vagrant image is built, vagrant ssh
- cd /vagrant
- Verify containers are up:  docker ps -a
- You can try docker-compose build j-edi-ui node
- docker-compose up -d

###  If you don't want to use vagrantn - You can fire up the application in "dev" mode

Verify that you have npm and node installed

For the node express server:

- cd app
- npm install
- node index

For the Angular App

- cd j-edi-ui
- npm install
- npm install -g @angular/cli
- npm start


