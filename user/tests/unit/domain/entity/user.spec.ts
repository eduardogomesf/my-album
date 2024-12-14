import { User } from '@/domain/entity'

describe('User Entity', () => {
  it('should create a new user', () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999',
      password: 'my-secure-password',
    })

    expect(user.id).toBeDefined()
    expect(user.firstName).toBe('John')
    expect(user.lastName).toBe('Doe')
    expect(user.email).toBe('john.doe@mail.com')
    expect(user.cellphone).toBe('11999999999')
    expect(user).toBeInstanceOf(User)
  })

  it('should not be able to create a new user without a first name', () => {
    expect(() => {
      new User({
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        cellphone: '11999999999',
        password: 'my-secure-password',
      } as any)
    }).toThrow('First name should not be empty')
  })

  it('should not be able to create a new user without a last name', () => {
    expect(() => {
      new User({
        firstName: 'John',
        email: 'john.doe@mail.com',
        cellphone: '11999999999',
        password: 'my-secure-password',
      } as any)
    }).toThrow('Last name should not be empty')
  })

  it('should not be able to create a new user without a email', () => {
    expect(() => {
      new User({
        firstName: 'John',
        lastName: 'Doe',
        cellphone: '11999999999',
        password: 'my-secure-password',
      } as any)
    }).toThrow('E-mail should not be empty')
  })

  it('should not be able to create a new user without a cellphone', () => {
    expect(() => {
      new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mail.com',
        password: 'my-secure-password',
      } as any)
    }).toThrow('Cellphone should not be empty')
  })

  it('should get the full name of a user', () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@mail.com',
      cellphone: '11999999999',
      password: 'my-secure-password',
    })

    expect(user.getFullName()).toBe('John Doe')
  })
})
