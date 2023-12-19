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
      NOTIFICATIONS: {
        EMAIL: process.env.KAFKA_TOPIC_EMAIL_NOTIFICATIONS ?? 'email-notifications'
      }
    },
    CONSUMER_GROUPS: {
      NOTIFICATIONS: {
        EMAIL: process.env.KAFKA_CONSUMER_GROUP_EMAIL_NOTIFICATIONS ?? 'email-notifications-CG'
      }
    }
  },
  SMTP: {
    DEFAULT: {
      EMAIL_HOST: process.env.SMTP_DEFAULT_EMAIL_HOST ?? '',
      EMAIL_PORT: Number(process.env.SMTP_DEFAULT_EMAIL_PORT ?? 1025),
      EMAIL_SECURE: process.env.SMTP_DEFAULT_EMAIL_SECURE ?? ''
    }
  }
} as const
