import { UserLoginUseCase } from '@/application/use-case'
import { generateMongoUserRepository } from '../repository'
import { generateBcrypPasswordValidator } from '../util/bcrypt-password-validator.factory'
import { generateJwtTokenGenerator } from '../util/jwt-token-generator.factory'

export const generateUserLoginUseCase = () => {
  const mongoUserRepository = generateMongoUserRepository()
  const passwordValidator = generateBcrypPasswordValidator()
  const jwtTokenGenerator = generateJwtTokenGenerator()
  return new UserLoginUseCase(mongoUserRepository, passwordValidator, jwtTokenGenerator)
}
