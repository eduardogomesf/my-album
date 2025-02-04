import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3000,
    ID: process.env.APP_ID ?? 'user-service',
    API_PREFIX: process.env.API_PREFIX ?? 'user-management/api/v1',
  },
  MONGO: {
    CONNECTION_NAME: process.env.MONGO_CONNECTION_NAME ?? 'user-service-mongo',
    URL: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
    DB_NAME: process.env.MONGO_DB_NAME ?? 'user-service-mongo',
  },
  ACCESS_TOKEN: {
    SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY ?? '',
    EXPIRATION_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? '1h',
  },
  REFRESH_TOKEN: {
    SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY ?? '',
    EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? '1d',
  },
  KAFKA: {
    BROKERS_URL: process.env.KAFKA_HOSTS
      ? String(process.env.KAFKA_HOSTS).split(',')
      : [],
    TOPICS: {
      USER: {
        CREATED: process.env.KAFKA_TOPIC_USER_CREATED ?? 'user-created',
      },
      NOTIFICATIONS: {
        EMAIL:
          process.env.KAFKA_TOPIC_EMAIL_NOTIFICATIONS ?? 'email-notifications',
      },
    },
  },
} as const
