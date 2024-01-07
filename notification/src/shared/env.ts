import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3000,
    ID: process.env.APP_ID ?? 'user-service'
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
        EMAIL: process.env.KAFKA_CONSUMER_GROUP_EMAIL_NOTIFICATIONS ?? 'email-notifications-consumer-group'
      }
    }
  },
  SMTP: {
    DEFAULT: {
      EMAIL_HOST: process.env.SMTP_DEFAULT_EMAIL_HOST ?? '',
      EMAIL_PORT: Number(process.env.SMTP_DEFAULT_EMAIL_PORT ?? 1025),
      EMAIL_SECURE: process.env.SMTP_DEFAULT_EMAIL_SECURE ?? ''
    },
    SOURCE_EMAILS: process.env.SOURCE_EMAILS ? String(process.env.SOURCE_EMAILS).split(',') : ['test@test.com']
  }
} as const
