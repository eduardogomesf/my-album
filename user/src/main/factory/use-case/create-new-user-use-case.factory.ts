import { CreateNewUserUseCase } from '@/application/use-case'
import {
  type FindUserByEmailRepository,
  type HashPassword,
  type CreateUserRepository,
  type MessageSender,
  type SendEmailNotification
} from '@/application/protocol'

export function generateCreateNewUserUseCase(
  findUserByEmailRepository: FindUserByEmailRepository,
  hashPassword: HashPassword,
  createUserRepository: CreateUserRepository,
  newUserCreatedSender: MessageSender,
  sendEmailNotification: SendEmailNotification
) {
  return new CreateNewUserUseCase(
    findUserByEmailRepository,
    hashPassword,
    createUserRepository,
    newUserCreatedSender,
    sendEmailNotification
  )
}
