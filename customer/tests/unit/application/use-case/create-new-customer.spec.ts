import { CreateNewCustomerUseCase } from '../../../../src/application/use-case'
import {
  type MessageSender,
  type CreateCustomerRepository,
  type FindCustomerByEmailRepository,
  type HashPassword,
  type SendEmailNotification
} from '../../../../src/application/protocol'

jest.mock('uuid', () => ({
  v4: () => 'any-id'
}))

describe('Create New Customer Use Case', () => {
  let sut: CreateNewCustomerUseCase
  let mockFindCustomerByEmailRepository: FindCustomerByEmailRepository
  let mockHashPassword: HashPassword
  let mockCreateCustomerRepository: CreateCustomerRepository
  let newCustomerCreatedSender: MessageSender
  let sendWelcomeNotification: SendEmailNotification

  beforeEach(() => {
    mockFindCustomerByEmailRepository = { findByEmail: jest.fn().mockResolvedValue(null) }
    mockHashPassword = { hash: jest.fn().mockResolvedValue('hashed-password') }
    mockCreateCustomerRepository = { create: jest.fn().mockResolvedValue(null) }
    newCustomerCreatedSender = { send: jest.fn().mockResolvedValue(true) }
    sendWelcomeNotification = { send: jest.fn().mockResolvedValue(true) }

    sut = new CreateNewCustomerUseCase(
      mockFindCustomerByEmailRepository,
      mockHashPassword,
      mockCreateCustomerRepository,
      newCustomerCreatedSender,
      sendWelcomeNotification
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

  it('should calls dependencies with correct input', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      password: 'random-password',
      cellphone: '11999999999'
    }

    const findByEmailSpy = jest.spyOn(mockFindCustomerByEmailRepository, 'findByEmail')
    const hashSpy = jest.spyOn(mockHashPassword, 'hash')
    const createSpy = jest.spyOn(mockCreateCustomerRepository, 'create')
    const newCustomerCreatedSpy = jest.spyOn(newCustomerCreatedSender, 'send')
    const sendWelcomeNotificationSpy = jest.spyOn(sendWelcomeNotification, 'send')

    await sut.create(payload)

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
    expect(newCustomerCreatedSpy).toHaveBeenCalledWith({
      id: 'any-id',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      cellphone: payload.cellphone
    })
    expect(sendWelcomeNotificationSpy).toHaveBeenCalledWith({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      title: 'Welcome to our platform',
      template: '<p>Hello, welcome to our platform.</p>'
    })
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
