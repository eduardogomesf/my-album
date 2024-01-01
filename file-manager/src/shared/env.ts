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
      CUSTOMER: {
        CREATED: process.env.KAFKA_TOPIC_CUSTOMER_CREATED ?? 'customer-created'
      }
    },
    CONSUMER_GROUPS: {
      NOTIFICATIONS: {
        EMAIL: process.env.KAFKA_CG_NEW_CUSTOMER ?? 'file-manager-new-customer'
      }
    }
  }
} as const
