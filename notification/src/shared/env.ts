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
  KAFKA: {
    BROKERS_URL: process.env.KAFKA_HOSTS ? String(process.env.KAFKA_HOSTS).split(',') : [],
    TOPICS: {
      CUSTOMER: {
        CREATED: process.env.KAFKA_TOPIC_CUSTOMER_CREATED ?? 'customer-created'
      },
      NOTIFICATIONS: {
        EMAIL: process.env.KAFKA_TOPIC_EMAIL_NOTIFICATIONS ?? 'email-notifications'
      }
    }
  }
} as const