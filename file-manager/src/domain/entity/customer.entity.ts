import { BaseEntity } from './base.entity'

interface CreateCustomerDTO {
  id?: string
  firstName: string
  lastName: string
  email: string
}

export class Customer extends BaseEntity {
  public readonly firstName: string
  public readonly lastName: string
  public readonly email: string

  constructor(payload: CreateCustomerDTO) {
    super(payload.id)
    this.firstName = payload.firstName
    this.lastName = payload.lastName
    this.email = payload.email

    this.validate()
  }

  private validate() {
    if (!this.id) throw new Error('ID should not be empty')
    if (!this.firstName) throw new Error('First name should not be empty')
    if (!this.lastName) throw new Error('Last name should not be empty')
    if (!this.email) throw new Error('E-mail should not be empty')
  }
}
