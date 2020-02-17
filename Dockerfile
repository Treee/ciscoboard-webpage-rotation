FROM alpine:latest

USER root

RUN apk add --update npm
RUN apk add --update chromium

WORKDIR /usr/src/app

COPY appdynamics.dexter ./appdynamics.dexter
RUN chmod +x ./appdynamics.dexter/core-linux/AppDynamics.Dexter
RUN mkdir -p screenshots
COPY package*.json ./

RUN npm install

COPY index.js ./

EXPOSE 8080

CMD ["node", "index.js"]
