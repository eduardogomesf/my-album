import { MongoConnectionManager } from '@/infra/database/mongodb/client'
import { bootstrapExpressServer } from './config/express'
import { generateKafkaClient } from '../infra/messaging/kafka'
import { ENVS, Logger } from '@/shared'
import { getApplicationUseCases } from './config/use-cases'

const logger = new Logger('bootstrap')

export async function bootstrap() {
  logger.info('Bootstrapping application...')

  MongoConnectionManager.getOrCreate(
    ENVS.MONGO.CONNECTION_NAME,
    ENVS.MONGO.URL,
    ENVS.MONGO.DB_NAME,
    {},
  )

  generateKafkaClient()

  const useCases = await getApplicationUseCases()

  bootstrapExpressServer(useCases)
}

bootstrap().catch((error) => {
  logger.fatal('Error bootstrapping application')
  logger.fatal(error)
  process.exit(1)
})
