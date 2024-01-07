import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3001,
    ID: process.env.APP_ID ?? 'file-manager-service'
  },
  KAFKA: {
    BROKERS_URL: process.env.KAFKA_HOSTS ? String(process.env.KAFKA_HOSTS).split(',') : [],
    TOPICS: {
      USER: {
        CREATED: process.env.KAFKA_TOPIC_USER_CREATED ?? 'user-created'
      }
    },
    CONSUMER_GROUPS: {
      USER: {
        NEW_USER: process.env.KAFKA_CG_NEW_USER ?? 'file-manager-new-user'
      }
    }
  }
} as const
