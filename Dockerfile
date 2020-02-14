FROM node:10

WORKDIR /usr/src/app

COPY appdynamics.dexter ./
COPY screeshots ./
COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 8080

CMD ["node", "index.js"]
