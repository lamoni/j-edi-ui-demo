FROM node:6-slim

RUN apt-get update && apt-get install -y git &&\
    npm cache clean

COPY ./j-edi-ui/package.json /var/j-edi-ui/package.json

WORKDIR /var/j-edi-ui

RUN npm install && npm install -g @angular/cli  &&\
    rm /var/j-edi-ui/node_modules/smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js

COPY ./jarvis.widget.ng2.js /var/j-edi-ui/node_modules/smartadmin-plugins/smartwidgets/jarvis.widget.ng2.js

CMD ["npm", "start"]