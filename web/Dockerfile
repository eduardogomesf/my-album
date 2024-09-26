FROM node:18.19.0-alpine AS deps
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18.19.0-alpine AS builder
WORKDIR /usr/app
COPY . .
COPY --from=deps /usr/app/node_modules ./node_modules
RUN npm run build

FROM node:18.19.0-alpine AS runner
WORKDIR /usr/app

COPY --from=builder /usr/app/next.config.mjs ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next ./.next
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
