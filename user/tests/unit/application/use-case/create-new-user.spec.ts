import { CreateNewUserUseCase } from '@/application/use-case'
import {
  type CreateUserRepository,
  type FindUserByEmailRepository,
  type HashPassword
} from '@/application/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Create New User Use Case', () => {
  let sut: CreateNewUserUseCase
  let mockFindUserByEmailRepository: FindUserByEmailRepository
  let mockHashPassword: HashPassword
  let mockCreateUserRepository: CreateUserRepository

  beforeEach(() => {
    mockFindUserByEmailRepository = { findByEmail: jest.fn().mockResolvedValue(null) }
    mockHashPassword = { hash: jest.fn().mockResolvedValue('hashed-password') }
    mockCreateUserRepository = { create: jest.fn().mockResolvedValue(null) }

    sut = new CreateNewUserUseCase(
      mockFindUserByEmailRepository,
      mockHashPassword,
      mockCreateUserRepository
    )
  })

  it('should create a new user successfully', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const findByEmailSpy = jest.spyOn(mockFindUserByEmailRepository, 'findByEmail')
    const hashSpy = jest.spyOn(mockHashPassword, 'hash')
    const createSpy = jest.spyOn(mockCreateUserRepository, 'create')

    await sut.execute(payload)

    expect(findByEmailSpy).toHaveBeenCalledWith(payload.email)
    expect(hashSpy).toHaveBeenCalledWith(payload.password)
    expect(createSpy).toHaveBeenCalledWith({
      id: 'any-id',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone,
      password: 'hashed-password'
    })
  })

  it('should not create a new user if e-mail is already in use', async () => {
    mockFindUserByEmailRepository.findByEmail = jest.fn().mockResolvedValue({
      id: 'any-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999'
    })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('E-mail already in use')
  })

  it('should pass along any error thrown when trying to find a user by id', async () => {
    mockFindUserByEmailRepository.findByEmail = jest.fn().mockImplementation(() => { throw new Error('any-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })

  it('should pass along any error thrown when trying to hash the password', async () => {
    mockHashPassword.hash = jest.fn().mockImplementation(() => { throw new Error('hash-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('hash-error'))
  })

  it('should pass along any error thrown when trying to create a user', async () => {
    mockCreateUserRepository.create = jest.fn().mockImplementation(() => { throw new Error('create-user-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('create-user-error'))
  })
})
