import { CreateNewUserUseCase } from '@/application/use-case'
import {
  type FindUserByEmailRepository,
  type HashPassword,
  type CreateUserRepository,
} from '@/application/protocol'

export function generateCreateNewUserUseCase(
  findUserByEmailRepository: FindUserByEmailRepository,
  hashPassword: HashPassword,
  createUserRepository: CreateUserRepository,
) {
  return new CreateNewUserUseCase(
    findUserByEmailRepository,
    hashPassword,
    createUserRepository,
  )
}
