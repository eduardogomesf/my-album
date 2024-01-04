import { type GetCustomerByEmailRepository, type CreateCustomerRepository } from '@/application/protocol'
import { AddNewCustomerUseCase } from '@/application/use-case'

export const generateAddNewCustomerUseCase = (
  getCustomerByEmailRepository: GetCustomerByEmailRepository,
  createCustomerRepository: CreateCustomerRepository
) => {
  return new AddNewCustomerUseCase(getCustomerByEmailRepository, createCustomerRepository)
}
