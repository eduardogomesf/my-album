import mongoose from 'mongoose'
import { ENVS, Logger } from '@/shared'

const logger = new Logger('MongoConnectionManager')
export class MongoConnectionManager {
  private static readonly connections: Record<string, mongoose.Connection> = {}

  static getOrCreate(
    connectionName: string,
    connectionURL?: string,
    dbName?: string,
    connectionOptions?: mongoose.ConnectOptions,
  ) {
    try {
      if (MongoConnectionManager.connections[connectionName]) {
        logger.info(`MongoDB connection ${connectionName} already exists`)
        return MongoConnectionManager.connections[connectionName]
      }

      logger.info('Connecting to MongoDB...')

      if (!connectionURL || !dbName || !connectionOptions) {
        throw new Error('Missing connectionURL, dbName or connectionOptions')
      }

      const createdConnection = mongoose.createConnection(connectionURL, {
        ...connectionOptions,
        dbName,
        appName: ENVS.APP.ID,
      })

      MongoConnectionManager.connections[connectionName] = createdConnection

      logger.info('Connected to MongoDB!')
      return createdConnection
    } catch (error) {
      logger.error('Error connecting to MongoDB')
      logger.error(error)
      throw error
    }
  }
}
