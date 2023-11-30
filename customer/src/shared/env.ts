import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3000,
    ID: process.env.APP_ID ?? 'customer-service'
  },
  MONGO: {
    CONNECTION_NAME: process.env.MONGO_CONNECTION_NAME ?? 'customer-service-mongo',
    URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
    DB_NAME: process.env.MONGO_DB_NAME ?? 'customer-service-mongo'
  },
  ACCESS_TOKEN: {
    SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY ?? ''
  },
  RABBIT_MQ: {
    URL: process.env.RABBIT_MQ_URL ?? 'amqp://localhost:5672',
    DELAY_TIMEOUT: process.env.RABBIT_MQ_DELAY_TIMEOUT ?? 5000,
    EXCHANGES: {
      CUSTOMER_REGISTRATION: {
        NAME: process.env.RABBIT_MQ_CUSTOMER_REGISTRATION_EXCHANGE ?? 'customer-registration',
        ROUTING_KEYS: {
          NEW_CUSTOMER_CREATED: process.env.RABBIT_MQ_CUSTOMER_REGISTRATION_ROUTING_KEY_NEW_CUSTOMER_CREATED ?? 'new-customer-created'
        }
      }
    }
  }
} as const
