import { type UseCases } from '@/presentation/interface/use-cases'
import { generateCreateNewCustomerUseCase, generateCustomerLoginUseCase } from '../factory/use-case'

export const getApplicationUseCases = async (): Promise<UseCases> => {
  return {
    createNewCustomer: await generateCreateNewCustomerUseCase(),
    customerLogin: generateCustomerLoginUseCase()
  }
}
