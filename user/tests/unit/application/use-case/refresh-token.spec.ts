import { RefreshTokenUseCase } from '@/application/use-case/refresh-token-use-case'
import {
  type UserExistsRepository,
  type TokenGenerator,
  type GetRefreshTokenByTokenAndUserIdRepository,
  type DeleteRefreshTokenByIdRepository,
  type TokenValidator,
  type SaveRefreshTokenRepository,
} from '@/application/protocol'

describe('Refresh Token Use Case', () => {
  let sut: RefreshTokenUseCase
  let mockUserExistsRepository: UserExistsRepository
  let mockAccessTokenGenerator: TokenGenerator
  let mockRefreshTokenGenerator: TokenGenerator
  let mockGetRefreshTokenByTokenAndUserIdRepository: GetRefreshTokenByTokenAndUserIdRepository
  let mockDeleteRefreshTokenByIdRepository: DeleteRefreshTokenByIdRepository
  let mockRefreshTokenValidator: TokenValidator
  let mockSaveRefreshToken: SaveRefreshTokenRepository

  beforeEach(() => {
    mockUserExistsRepository = {
      exists: jest.fn().mockResolvedValue(true),
    }
    mockAccessTokenGenerator = {
      generate: jest.fn().mockResolvedValue('any_access_token'),
    }
    mockRefreshTokenGenerator = {
      generate: jest.fn().mockResolvedValue('any_refresh_token'),
    }
    mockGetRefreshTokenByTokenAndUserIdRepository = {
      getByTokenAndUserId: jest.fn().mockResolvedValue({
        id: 'any_id',
        token: 'any_refresh_token',
        userId: 'any_user_id',
      }),
    }
    mockDeleteRefreshTokenByIdRepository = {
      delete: jest.fn().mockResolvedValue(null),
    }
    mockRefreshTokenValidator = {
      validate: jest.fn().mockResolvedValue({
        isValid: true,
      }),
    }
    mockSaveRefreshToken = {
      save: jest.fn().mockResolvedValue(null),
    }
    sut = new RefreshTokenUseCase(
      mockUserExistsRepository,
      mockAccessTokenGenerator,
      mockRefreshTokenGenerator,
      mockGetRefreshTokenByTokenAndUserIdRepository,
      mockDeleteRefreshTokenByIdRepository,
      mockRefreshTokenValidator,
      mockSaveRefreshToken,
    )
  })

  it('should successfully refresh token', async () => {
    const result = await sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    const deleteByIdSpy = jest.spyOn(
      mockDeleteRefreshTokenByIdRepository,
      'delete',
    )

    expect(result).toEqual({
      ok: true,
      data: {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
        userId: 'any_user_id',
      },
    })
    expect(deleteByIdSpy).toHaveBeenCalled()
  })

  it('should should not refresh token if user does not exist', async () => {
    mockUserExistsRepository.exists = jest.fn().mockResolvedValueOnce(false)

    const result = await sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'User not found',
    })
  })

  it('should not refresh token if the token does not exist', async () => {
    mockGetRefreshTokenByTokenAndUserIdRepository.getByTokenAndUserId = jest
      .fn()
      .mockResolvedValueOnce(null)

    const deleteByIdSpy = jest.spyOn(
      mockDeleteRefreshTokenByIdRepository,
      'delete',
    )
    const validateSpy = jest.spyOn(mockRefreshTokenValidator, 'validate')

    const result = await sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Invalid refresh token',
    })

    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(validateSpy).not.toHaveBeenCalled()
  })

  it('should not refresh token if the token is invalid', async () => {
    mockRefreshTokenValidator.validate = jest.fn().mockResolvedValueOnce({
      isValid: false,
      invalidationReason: 'INVALID',
    })

    const deleteByIdSpy = jest.spyOn(
      mockDeleteRefreshTokenByIdRepository,
      'delete',
    )

    const result = await sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Invalid refresh token',
    })
    expect(deleteByIdSpy).toHaveBeenCalled()
  })

  it('should not refresh token if the token is expired', async () => {
    mockRefreshTokenValidator.validate = jest.fn().mockResolvedValueOnce({
      isValid: false,
      invalidationReason: 'EXPIRED',
    })

    const deleteByIdSpy = jest.spyOn(
      mockDeleteRefreshTokenByIdRepository,
      'delete',
    )

    const result = await sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    expect(result).toEqual({
      ok: false,
      message: 'Expired refresh token',
    })
    expect(deleteByIdSpy).toHaveBeenCalled()
  })

  it('should pass along any error that occurs', async () => {
    mockUserExistsRepository.exists = jest
      .fn()
      .mockRejectedValueOnce(new Error('any_error'))

    const promise = sut.execute({
      refreshToken: 'any_refresh_token',
      userId: 'any_user_id',
    })

    await expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
