import { CustomerLoginUseCase } from '../../../application/use-case'
import { generateMongoCustomerRepository } from '../repository'
import { generateBcrypPasswordValidator } from '../util/bcrypt-password-validator.factory'
import { generateJwtTokenGenerator } from '../util/jwt-token-generator.factory'

export const generateCustomerLoginUseCase = () => {
  const mongoCustomerRepository = generateMongoCustomerRepository()
  const passwordValidator = generateBcrypPasswordValidator()
  const jwtTokenGenerator = generateJwtTokenGenerator()
  return new CustomerLoginUseCase(mongoCustomerRepository, passwordValidator, jwtTokenGenerator)
}
