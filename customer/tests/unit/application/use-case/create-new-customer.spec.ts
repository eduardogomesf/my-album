import { CreateNewCustomerUseCase } from '../../../../src/application/use-case'
import {
  type CreateCustomerRepository,
  type FindCustomerByEmailRepository,
  type HashPassword
} from '../../../../src/application/protocol'

describe('Create New Customer Use Case', () => {
  let sut: CreateNewCustomerUseCase
  let mockFindCustomerByEmailRepository: FindCustomerByEmailRepository
  let mockHashPassword: HashPassword
  let mockCreateCustomerRepository: CreateCustomerRepository

  beforeEach(() => {
    mockFindCustomerByEmailRepository = { findByEmail: jest.fn().mockResolvedValue(null) }
    mockHashPassword = { hash: jest.fn().mockResolvedValue('hashed-password') }
    mockCreateCustomerRepository = { create: jest.fn().mockResolvedValue(null) }

    sut = new CreateNewCustomerUseCase(
      mockFindCustomerByEmailRepository,
      mockHashPassword,
      mockCreateCustomerRepository
    )
  })

  it('should create a new customer successfully', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = await sut.create(payload)

    expect(result.ok).toBe(true)
  })

  it('should not create a new customer if e-mail is already in use', async () => {
    mockFindCustomerByEmailRepository.findByEmail = jest.fn().mockResolvedValue({
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

    const result = await sut.create(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('E-mail already in use')
  })

  it('should pass along any error thrown when trying to find a customer by id', async () => {
    mockFindCustomerByEmailRepository.findByEmail = jest.fn().mockImplementation(() => { throw new Error('any-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = sut.create(payload)

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

    const result = sut.create(payload)

    await expect(result).rejects.toThrow(new Error('hash-error'))
  })

  it('should pass along any error thrown when trying to create a customer', async () => {
    mockCreateCustomerRepository.create = jest.fn().mockImplementation(() => { throw new Error('create-customer-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const result = sut.create(payload)

    await expect(result).rejects.toThrow(new Error('create-customer-error'))
  })
})
