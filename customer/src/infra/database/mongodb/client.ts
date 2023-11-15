import mongoose from 'mongoose'
import { ENVS } from '../../../shared'

export async function connectToMongo() {
  try {
    await mongoose.connect(ENVS.MONGO.URL, {
      appName: 'customer-service',
      dbName: ENVS.MONGO.DB_NAME
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB')
    console.error(error)
    process.exit(1)
  }
}
