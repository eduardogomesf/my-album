import { type UseCases } from '../presentation/interface/use-cases'
import { startExpressServer } from '../presentation/rest/setup'
import { generateCreateNewCustomerUseCase } from './factory/use-case/create-new-customer-use-case.factory'

export function bootstrap() {
  const useCases: UseCases = {
    createNewCustomer: generateCreateNewCustomerUseCase()
  }

  startExpressServer(useCases)
}

bootstrap()
