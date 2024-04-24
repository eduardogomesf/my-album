import { UserLoginUseCase } from '@/application/use-case'
import {
  type FindUserByEmailRepository,
  type PasswordValidator,
  type TokenGenerator
} from '@/application/protocol'

export const generateUserLoginUseCase = (
  findUserByEmailRepository: FindUserByEmailRepository,
  passwordValidator: PasswordValidator,
  tokenGenerator: TokenGenerator
) => {
  return new UserLoginUseCase(
    findUserByEmailRepository,
    passwordValidator,
    tokenGenerator
  )
}
