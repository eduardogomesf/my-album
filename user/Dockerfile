FROM node:18.19.0-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY .env.example .env

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
