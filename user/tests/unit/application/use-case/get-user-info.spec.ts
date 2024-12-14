import { GetUserInfoUseCase } from '@/application/use-case'
import { type FindUserByIdRepository } from '@/application/protocol'

describe('Get User Info Use Case', () => {
  let sut: GetUserInfoUseCase
  let mockFindUserByIdRepository: FindUserByIdRepository

  beforeEach(() => {
    mockFindUserByIdRepository = {
      findById: jest.fn().mockResolvedValue({
        id: 'any-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        cellphone: '5511999999999',
        password: 'hashed-password',
      }),
    }

    sut = new GetUserInfoUseCase(mockFindUserByIdRepository)
  })

  it('should get user info successfully', async () => {
    const result = await sut.execute({
      userId: 'any-id',
    })

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: 'any-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '5511999999999',
    })
  })

  it('should not retrieve user info if user does not exist', async () => {
    mockFindUserByIdRepository.findById = jest.fn().mockResolvedValue(null)

    const result = await sut.execute({
      userId: 'any-id',
    })

    expect(result.ok).toBe(false)
    expect(result.message).toBe('User not found')
  })

  it('should pass along any error thrown', async () => {
    mockFindUserByIdRepository.findById = jest.fn().mockImplementation(() => {
      throw new Error('any-error')
    })

    const result = sut.execute({
      userId: 'any-id',
    })

    await expect(result).rejects.toThrow(new Error('any-error'))
  })
})
