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
    SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY ?? ''
  },
  RABBIT_MQ: {
    URL: process.env.RABBIT_MQ_URL ?? 'amqp://localhost:5672',
    QUEUES: {
      NEW_CUSTOMER_CREATED: {
        NAME: process.env.RABBIT_MQ_NEW_CUSTOMER_CREATED_QUEUE ?? 'new-customer-created',
        DURABLE: true
      }
    }
  }
} as const
