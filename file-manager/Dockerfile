# Builder
FROM node:18.19.0-alpine AS builder
WORKDIR /usr/app
COPY . .
RUN npm install && npm run build

# Runner
FROM node:18.19.0-alpine AS runner
WORKDIR /usr/app
COPY .env.example .env
COPY tsconfig.json .
COPY tsconfig-build.json .
COPY --from=builder /usr/app/package.json .
RUN npm install --omit=dev
COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/prisma ./prisma

EXPOSE 3001

CMD ["npm", "start"]
