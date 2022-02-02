FROM node:16

ENV PDF2HTML_PORT=8000
ENV FTP_PORT=8125

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
EXPOSE 8125

CMD [ "node", "src/server.js"]









