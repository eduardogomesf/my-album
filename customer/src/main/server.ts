import { connectToMongo } from '../infra/database/mongodb/client'
import { type UseCases } from '../presentation/interface/use-cases'
import { startExpressServer } from '../presentation/rest/setup'
import { generateCreateNewCustomerUseCase } from './factory/use-case/create-new-customer-use-case.factory'

export async function bootstrap() {
  await connectToMongo()

  const useCases: UseCases = {
    createNewCustomer: generateCreateNewCustomerUseCase()
  }

  startExpressServer(useCases)
}

bootstrap().catch(error => {
  console.error('Error bootstrapping application')
  console.error(error)
  process.exit(1)
})
