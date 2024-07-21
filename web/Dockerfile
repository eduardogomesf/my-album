# Dependencies installation
FROM node:18.19.0-alpine AS deps
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM node:18.19.0-alpine AS builder
WORKDIR /usr/app
COPY . .
COPY --from=deps /usr/app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM node:18.19.0-alpine AS runner
WORKDIR /usr/app

# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /usr/app/next.config.mjs ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next ./.next
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
