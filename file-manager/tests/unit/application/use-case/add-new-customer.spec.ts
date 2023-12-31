import { AddNewCustomerUseCase } from '@/application/use-case'
import { type CreateCustomerRepository, type GetCustomerByEmailRepository } from '@/application/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Add New Customer Use Case', () => {
  let sut: AddNewCustomerUseCase
  let mockFindCustomerByEmailRepository: GetCustomerByEmailRepository
  let mockCreateCustomerRepository: CreateCustomerRepository

  beforeEach(() => {
    mockFindCustomerByEmailRepository = { getByEmail: jest.fn().mockResolvedValue(null) }
    mockCreateCustomerRepository = { create: jest.fn().mockResolvedValue(null) }

    sut = new AddNewCustomerUseCase(
      mockFindCustomerByEmailRepository,
      mockCreateCustomerRepository
    )
  })

  it('should create a new customer successfully', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: 'any-id',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    })
  })

  it('should calls dependencies with correct input', async () => {
    const payload = {
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    }

    const getByEmailSpy = jest.spyOn(mockFindCustomerByEmailRepository, 'getByEmail')
    const createSpy = jest.spyOn(mockCreateCustomerRepository, 'create')

    await sut.execute(payload)

    expect(createSpy).toHaveBeenCalledWith({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    })
    expect(getByEmailSpy).toHaveBeenCalledWith(payload.email)
  })

  it('should not create a new customer if e-mail is already in use', async () => {
    mockFindCustomerByEmailRepository.getByEmail = jest.fn().mockResolvedValue({
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    })

    const payload = {
      id: 'existing-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    }

    const result = await sut.execute(payload)

    expect(result.ok).toBe(true)
    expect(result.data).toEqual({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email
    })
    expect(result.message).toBe('Customer already exists')
  })

  it('should pass along any error thrown when trying to get a customer by id', async () => {
    mockFindCustomerByEmailRepository.getByEmail = jest.fn().mockImplementation(() => { throw new Error('any-error') })

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('any-error'))
  })

  it('should pass along any error thrown when trying to create a customer', async () => {
    mockCreateCustomerRepository.create = jest.fn().mockImplementation(
      () => { throw new Error('create-customer-error') }
    )

    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    }

    const result = sut.execute(payload)

    await expect(result).rejects.toThrow(new Error('create-customer-error'))
  })
})
