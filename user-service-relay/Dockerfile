FROM node:18.19.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY .env.example .env

COPY . .

CMD ["npm", "start"]
