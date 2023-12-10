import { MongoConnectionManager } from '@/infra/database/mongodb/client'
import { startExpressServer } from '@/presentation/rest/setup'
import { type UseCases } from '@/presentation/interface/use-cases'
import { generateCreateNewCustomerUseCase, generateCustomerLoginUseCase } from './factory/use-case'
import { generateKafkaClient } from '../infra/messaging/kafka'
import { ENVS, Logger } from '@/shared'

export async function bootstrap() {
  MongoConnectionManager.getOrCreate(
    ENVS.MONGO.CONNECTION_NAME,
    ENVS.MONGO.URL,
    ENVS.MONGO.DB_NAME,
    {}
  )

  await generateKafkaClient()

  const useCases: UseCases = {
    createNewCustomer: await generateCreateNewCustomerUseCase(),
    customerLogin: generateCustomerLoginUseCase()
  }

  startExpressServer(useCases)
}

bootstrap().catch(error => {
  Logger.fatal('Error bootstrapping application')
  Logger.fatal(error)
  process.exit(1)
})
