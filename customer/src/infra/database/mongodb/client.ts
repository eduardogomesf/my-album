import mongoose from 'mongoose'

export async function connectToMongo() {
  const connectionURL = process.env.MONGO_URL ?? 'mongodb://localhost:27017'
  try {
    await mongoose.connect(connectionURL, {
      appName: 'customer-service'
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB')
    console.error(error)
    process.exit(1)
  }
}
