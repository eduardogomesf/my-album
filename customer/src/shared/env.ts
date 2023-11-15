export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3000
  },
  MONGO: {
    URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
    DB_NAME: process.env.MONGO_DB_NAME ?? 'customer-service-mongo'
  }
} as const
