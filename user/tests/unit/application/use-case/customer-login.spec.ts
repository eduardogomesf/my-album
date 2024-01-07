import { type PasswordValidator, type FindCustomerByEmailRepository, type TokenGenerator } from '../../../../src/application/protocol'
import { CustomerLoginUseCase } from '../../../../src/application/use-case'

describe('Customer Login Use Case', () => {
  let sut: CustomerLoginUseCase
  let findCustomerByEmailRepository: FindCustomerByEmailRepository
  let passwordValidator: PasswordValidator
  let tokenGenerator: TokenGenerator

  beforeEach(() => {
    findCustomerByEmailRepository = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 'any-id',
        name: 'any-name',
        email: 'any-email',
        password: 'any-password'
      })
    }
    passwordValidator = {
      validate: jest.fn().mockResolvedValue(true)
    }
    tokenGenerator = {
      generate: jest.fn().mockResolvedValue('any-token')
    }

    sut = new CustomerLoginUseCase(
      findCustomerByEmailRepository,
      passwordValidator,
      tokenGenerator
    )
  })

  it('should successfully login a customer', async () => {
    const result = await sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: true,
      data: {
        token: 'any-token'
      }
    })
  })

  it('should not allow a customer to login if email is invalid', async () => {
    jest.spyOn(findCustomerByEmailRepository, 'findByEmail').mockResolvedValueOnce(null)

    const result = await sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: false,
      message: 'No customer found with the given credentials'
    })
  })

  it('should not allow a customer to login if password is invalid', async () => {
    jest.spyOn(passwordValidator, 'validate').mockResolvedValueOnce(false)

    const result = await sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: false,
      message: 'No customer found with the given credentials'
    })
  })

  it('should pass along any error thrown when trying to find a customer by email', async () => {
    jest.spyOn(findCustomerByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('find-by-email-error'))

    const result = sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('find-by-email-error'))
  })

  it('should pass along any error thrown when trying to validate password', async () => {
    jest.spyOn(findCustomerByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('validate-password-error'))

    const result = sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('validate-password-error'))
  })

  it('should pass along any error thrown when trying to generate token', async () => {
    jest.spyOn(findCustomerByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('generate-token-error'))

    const result = sut.login({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('generate-token-error'))
  })
})
