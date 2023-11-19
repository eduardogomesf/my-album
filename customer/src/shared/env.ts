import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3000
  },
  MONGO: {
    URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
    DB_NAME: process.env.MONGO_DB_NAME ?? 'customer-service-mongo'
  },
  ACCESS_TOKEN: {
    SECRET_KEY: '40a728fbd7dfe4aa9266b6fce91784cf'
  }
} as const
