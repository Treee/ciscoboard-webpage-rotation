FROM node:10

WORKDIR /usr/src/app

COPY appdynamics.dexter ./appdynamics.dexter
RUN chmod +x ./appdynamics.dexter/core-linux/AppDynamics.Dexter
RUN mkdir -p screenshots
COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 8080

CMD ["node", "index.js"]
