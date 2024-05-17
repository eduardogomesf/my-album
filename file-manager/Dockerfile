FROM node:18.19.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.example .env

EXPOSE 3002

CMD ["npm", "start"]
