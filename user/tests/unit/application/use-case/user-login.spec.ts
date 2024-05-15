import {
  type PasswordValidator,
  type FindUserByEmailRepository,
  type TokenGenerator,
  type SaveRefreshTokenRepository
} from '@/application/protocol'
import { UserLoginUseCase } from '@/application/use-case'

describe('User Login Use Case', () => {
  let sut: UserLoginUseCase
  let findUserByEmailRepository: FindUserByEmailRepository
  let passwordValidator: PasswordValidator
  let tokenGenerator: TokenGenerator
  let refreshTokenGenerator: TokenGenerator
  let saveRefreshTokenRepository: SaveRefreshTokenRepository

  beforeEach(() => {
    findUserByEmailRepository = {
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
    refreshTokenGenerator = {
      generate: jest.fn().mockResolvedValue('any-token')
    }
    saveRefreshTokenRepository = {
      save: jest.fn().mockResolvedValue(null)
    }

    sut = new UserLoginUseCase(
      findUserByEmailRepository,
      passwordValidator,
      tokenGenerator,
      refreshTokenGenerator,
      saveRefreshTokenRepository
    )
  })

  it('should successfully login a user', async () => {
    const result = await sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: true,
      data: {
        accessToken: 'any-token',
        refreshToken: 'any-token',
        userId: 'any-id'
      }
    })
  })

  it('should not allow a user to login if email is invalid', async () => {
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockResolvedValueOnce(null)

    const result = await sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: false,
      message: 'No user found with the given credentials'
    })
  })

  it('should not allow a user to login if password is invalid', async () => {
    jest.spyOn(passwordValidator, 'validate').mockResolvedValueOnce(false)

    const result = await sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    expect(result).toEqual({
      ok: false,
      message: 'No user found with the given credentials'
    })
  })

  it('should pass along any error thrown when trying to find a user by email', async () => {
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('find-by-email-error'))

    const result = sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('find-by-email-error'))
  })

  it('should pass along any error thrown when trying to validate password', async () => {
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('validate-password-error'))

    const result = sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('validate-password-error'))
  })

  it('should pass along any error thrown when trying to generate token', async () => {
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockRejectedValueOnce(new Error('generate-token-error'))

    const result = sut.execute({
      email: 'any-email',
      password: 'any-password'
    })

    await expect(result).rejects.toThrow(new Error('generate-token-error'))
  })
})
