import { AddNewUserUseCase } from '@/application/use-case'
import {
  type CreateUserRepository,
  type GetUserByEmailRepository,
} from '@/application/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id',
}))

describe('Add New User Use Case', () => {
  let sut: AddNewUserUseCase
  let mockFindUserByEmailRepository: GetUserByEmailRepository
  let mockCreateUserRepository: CreateUserRepository

  beforeEach(() => {
    mockFindUserByEmailRepository = {
      getByEmail: jest.fn().mockResolvedValue(null),
    }
    mockCreateUserRepository = { create: jest.fn().mockResolvedValue(null) }

    sut = new AddNewUserUseCase(
      mockFindUserByEmailRepository,
      mockCreateUserRepository,
    )
  })

  it('should create a new user successfully', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: 'any-id',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    }

    const getByEmailSpy = jest.spyOn(
      mockFindUserByEmailRepository,
      'getByEmail',
    )
    const createSpy = jest.spyOn(mockCreateUserRepository, 'create')

    await sut.execute(payload)

    expect(createSpy).toHaveBeenCalledWith({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
    expect(getByEmailSpy).toHaveBeenCalledWith(payload.email)
  })

  it('should not create a new user if e-mail is already in use', async () => {
    mockFindUserByEmailRepository.getByEmail = jest.fn().mockResolvedValue({
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    })

    const payload = {
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
    expect(result.message).toBe('User already exists')
  })

  it('should pass along any error thrown when trying to get a user by id', async () => {
    mockFindUserByEmailRepository.getByEmail = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('any-error')
      })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })

  it('should pass along any error thrown when trying to create a user', async () => {
    mockCreateUserRepository.create = jest.fn().mockImplementation(() => {
      throw new Error('create-user-error')
    })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('create-user-error'))
  })
})
