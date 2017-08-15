FROM node:6-slim

RUN npm cache clean

COPY ./app/package.json /var/app/package.json

WORKDIR /var/app

RUN npm install

CMD ["npm", "start"]