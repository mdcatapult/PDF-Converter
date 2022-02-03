FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
EXPOSE 8125

CMD [ "node", "src/server.js"]









