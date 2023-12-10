import mongoose from 'mongoose'
import { ENVS, Logger } from '@/shared'

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
        Logger.info(`MongoDB connection ${connectionName} already exists`)
        return MongoConnectionManager.connections[connectionName]
      }

      Logger.info('Connecting to MongoDB...')

      if (!connectionURL || !dbName || !connectionOptions) {
        throw new Error('Missing connectionURL, dbName or connectionOptions')
      }

      const createdConnection = mongoose.createConnection(connectionURL, {
        ...connectionOptions,
        dbName,
        appName: ENVS.APP.ID
      })

      MongoConnectionManager.connections[connectionName] = createdConnection

      Logger.info('Connected to MongoDB!')
      return createdConnection
    } catch (error) {
      Logger.error('Error connecting to MongoDB')
      Logger.error(error)
      throw error
    }
  }
}
