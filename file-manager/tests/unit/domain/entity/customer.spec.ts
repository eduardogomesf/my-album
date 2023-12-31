import { Customer } from '@/domain/entity/customer.entity'

describe('Customer Entity', () => {
  it('should create a new customer', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com'
    })

    expect(customer.id).toBeDefined()
    expect(customer.firstName).toBe('John')
    expect(customer.lastName).toBe('Doe')
    expect(customer.email).toBe('john.doe@mail.com')
    expect(customer).toBeInstanceOf(Customer)
  })

  it('should not be able to create a new customer without a first name', () => {
    expect(() => {
      new Customer({
        lastName: 'Doe',
        email: 'john.doe@mail.com'
      } as any)
    }).toThrow('First name should not be empty')
  })

  it('should not be able to create a new customer without a last name', () => {
    expect(() => {
      new Customer({
        firstName: 'John',
        email: 'john.doe@mail.com'
      } as any)
    }).toThrow('Last name should not be empty')
  })

  it('should not be able to create a new customer without a email', () => {
    expect(() => {
      new Customer({
        firstName: 'John',
        lastName: 'Doe'
      } as any)
    }).toThrow('E-mail should not be empty')
  })
})
