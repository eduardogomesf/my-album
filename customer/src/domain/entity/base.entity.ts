import { v4 as uuid } from 'uuid'

export abstract class BaseEntity {
  protected readonly _id: string

  constructor (id?: string) {
    this._id = id ?? uuid()
  }
}
