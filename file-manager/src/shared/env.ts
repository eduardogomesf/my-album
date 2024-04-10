import * as dotenv from 'dotenv'

dotenv.config()

export const ENVS = {
  APP: {
    PORT: process.env.PORT ?? 3001,
    ID: process.env.ID ?? 'file-manager-service',
    URL: process.env.URL ?? 'http://localhost:3002'
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
  },
  S3: {
    BUCKET_NAME: process.env.S3_BUCKET_NAME ?? 'file-manager',
    REGION: process.env.S3_REGION ?? 'us-east-1',
    URL: process.env.S3_URL ?? 'http://localhost:4566',
    STORAGE_CLASS: process.env.S3_STORAGE_CLASS ?? 'STANDARD',
    ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID ?? 'test',
    SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ?? 'test'
  }
} as const
