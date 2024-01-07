import { type GetUserByEmailRepository, type CreateUserRepository } from '@/application/protocol'
import { AddNewUserUseCase } from '@/application/use-case'

export const generateAddNewUserUseCase = (
  getUserByEmailRepository: GetUserByEmailRepository,
  createUserRepository: CreateUserRepository
) => {
  return new AddNewUserUseCase(getUserByEmailRepository, createUserRepository)
}
