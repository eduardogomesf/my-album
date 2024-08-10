import { BaseEntity } from './base.entity'

interface CreateUserDTO {
  id?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  cellphone: string
}

export class User extends BaseEntity {
  public readonly firstName: string
  public readonly lastName: string
  public readonly email: string
  public readonly password: string
  public readonly cellphone: string

  constructor(payload: CreateUserDTO) {
    super(payload.id)
    this.firstName = payload.firstName
    this.lastName = payload.lastName
    this.email = payload.email
    this.cellphone = payload.cellphone
    this.password = payload.password ?? ''

    this.validate()
  }

  private validate() {
    if (!this.firstName) throw new Error('First name should not be empty')
    if (!this.lastName) throw new Error('Last name should not be empty')
    if (!this.email) throw new Error('E-mail should not be empty')
    if (!this.cellphone) throw new Error('Cellphone should not be empty')
  }

  public getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
