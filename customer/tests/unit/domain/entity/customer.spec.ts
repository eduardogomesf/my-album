import { Customer } from '../../../../src/domain/entity/customer.entity'

describe('Customer Entity', () => {
  it('should create a new customer', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999',
      password: 'my-secure-password'
    })

    expect(customer.id).toBeDefined()
    expect(customer.firstName).toBe('John')
    expect(customer.lastName).toBe('Doe')
    expect(customer.email).toBe('john.doe@mail.com')
    expect(customer.cellphone).toBe('11999999999')
    expect(customer).toBeInstanceOf(Customer)
  })

  it('should not be able to create a new customer without a first name', () => {
    expect(() => {
      new Customer({
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        cellphone: '11999999999',
        password: 'my-secure-password'
      } as any)
    }).toThrow('First name should not be empty')
  })

  it('should not be able to create a new customer without a last name', () => {
    expect(() => {
      new Customer({
        firstName: 'John',
        email: 'john.doe@mail.com',
        cellphone: '11999999999',
        password: 'my-secure-password'
      } as any)
    }).toThrow('Last name should not be empty')
  })

  it('should not be able to create a new customer without a email', () => {
    expect(() => {
      new Customer({
        firstName: 'John',
        lastName: 'Doe',
        cellphone: '11999999999',
        password: 'my-secure-password'
      } as any)
    }).toThrow('E-mail should not be empty')
  })

  it('should not be able to create a new customer without a cellphone', () => {
    expect(() => {
      new Customer({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        password: 'my-secure-password'
      } as any)
    }).toThrow('Cellphone should not be empty')
  })

  it('should get the full name of a customer', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999',
      password: 'my-secure-password'
    })

    expect(customer.getFullName()).toBe('John Doe')
  })

  it('should get the password of a customer', () => {
    const customer = new Customer({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999',
      password: 'my-secure-password'
    })

    expect(customer.getPassword()).toBe('my-secure-password')
  })
})
