import mongoose from 'mongoose'
import { ENVS } from '@/shared'

export class MongoConnectionManager {
  private static readonly connections: Record<string, mongoose.Connection> = {}

  static getOrCreate(
    connectionName: string,
    connectionURL?: string,
    dbName?: string,
    connectionOptions?: mongoose.ConnectOptions
  ) {
    try {
      if (MongoConnectionManager.connections[connectionName]) {
        console.log(`MongoDB connection ${connectionName} already exists`)
        return MongoConnectionManager.connections[connectionName]
      }

      console.log('Connecting to MongoDB...')

      if (!connectionURL || !dbName || !connectionOptions) {
        throw new Error('Missing connectionURL, dbName or connectionOptions')
      }

      const createdConnection = mongoose.createConnection(connectionURL, {
        ...connectionOptions,
        dbName,
        appName: ENVS.APP.ID
      })

      MongoConnectionManager.connections[connectionName] = createdConnection

      console.log('Connected to MongoDB!')
      return createdConnection
    } catch (error) {
      console.error('Error connecting to MongoDB')
      console.error(error)
      process.exit(1)
    }
  }
}
