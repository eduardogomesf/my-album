import { MongoConnectionManager } from '@/infra/database/mongodb/client'
import { startExpressServer } from '@/presentation/rest/setup'
import { generateKafkaClient } from '../infra/messaging/kafka'
import { ENVS, Logger } from '@/shared'
import { getApplicationUseCases } from './config/use-cases'

export async function bootstrap() {
  MongoConnectionManager.getOrCreate(
    ENVS.MONGO.CONNECTION_NAME,
    ENVS.MONGO.URL,
    ENVS.MONGO.DB_NAME,
    {}
  )

  await generateKafkaClient()

  const useCases = await getApplicationUseCases()

  startExpressServer(useCases)
}

bootstrap().catch(error => {
  Logger.fatal('Error bootstrapping application')
  Logger.fatal(error)
  process.exit(1)
})
