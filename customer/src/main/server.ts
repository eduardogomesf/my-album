import { MongoConnectionManager } from '@/infra/database/mongodb/client'
import { startExpressServer } from '@/presentation/rest/setup'
import { type UseCases } from '@/presentation/interface/use-cases'
import { generateCreateNewCustomerUseCase, generateCustomerLoginUseCase } from './factory/use-case'
import { generateRabbitMQConnectionAndMainChannel } from '@/infra/messaging-system/rabbitmq/client'
import { ENVS } from '@/shared'

export async function bootstrap() {
  MongoConnectionManager.getOrCreate(
    ENVS.MONGO.CONNECTION_NAME,
    ENVS.MONGO.URL,
    ENVS.MONGO.DB_NAME,
    {}
  )

  await generateRabbitMQConnectionAndMainChannel()

  const useCases: UseCases = {
    createNewCustomer: generateCreateNewCustomerUseCase(),
    customerLogin: generateCustomerLoginUseCase()
  }

  startExpressServer(useCases)
}

bootstrap().catch(error => {
  console.error('Error bootstrapping application')
  console.error(error)
  process.exit(1)
})
