import { CreateNewUserUseCase } from '@/application/use-case'
import {
  type FindUserByEmailRepository,
  type HashPassword,
  type CreateUserRepository,
  type SendEmailNotification
} from '@/application/protocol'

export function generateCreateNewUserUseCase(
  findUserByEmailRepository: FindUserByEmailRepository,
  hashPassword: HashPassword,
  createUserRepository: CreateUserRepository,
  sendEmailNotification: SendEmailNotification
) {
  return new CreateNewUserUseCase(
    findUserByEmailRepository,
    hashPassword,
    createUserRepository,
    sendEmailNotification
  )
}
