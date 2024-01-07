import { type CustomerLoginUseCase, type CreateNewCustomerUseCase } from '../../application/use-case'

export interface UseCases {
  createNewCustomer: CreateNewCustomerUseCase
  customerLogin: CustomerLoginUseCase
}
