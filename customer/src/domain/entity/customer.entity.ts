import { BaseEntity } from './base.entity'

interface CreateCustomerDTO {
  id?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  cellphone: string
}

export class Customer extends BaseEntity {
  private readonly _firstName: string
  private readonly _lastName: string
  private readonly _email: string
  private readonly _password: string
  private readonly _cellphone: string

  constructor (payload: CreateCustomerDTO) {
    super(payload.id)
    this._firstName = payload.firstName
    this._lastName = payload.lastName
    this._email = payload.email
    this._cellphone = payload.cellphone
    this._password = payload.password ?? ''

    this.validate()
  }

  private validate () {
    if (!this._id) throw new Error('ID should not be empty')
    if (!this._firstName) throw new Error('First name should not be empty')
    if (!this._lastName) throw new Error('Last name should not be empty')
    if (!this._email) throw new Error('E-mail should not be empty')
    if (!this._cellphone) throw new Error('Cellphone should not be empty')
  }

  public getFullName () {
    return `${this._firstName} ${this._lastName}`
  }

  // getters
  get id () { return this._id }
  get firstName () { return this._firstName }
  get lastName () { return this._lastName }
  get email () { return this._email }
  get cellphone () { return this._cellphone }
  get password () { return this._password }
}
