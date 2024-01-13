import { BaseEntity } from './base.entity'

interface CreateFileDTO {
  id?: string
  name: string
  path: string
  size: number
  extension: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export class File extends BaseEntity {
  name: string
  path: string
  size: number
  extension: string
  userId: string
  createdAt: string | null
  updatedAt: string | null

  constructor(data: CreateFileDTO) {
    super(data.id)
    this.name = data.name
    this.path = data.path
    this.size = data.size
    this.extension = data.extension
    this.userId = data.userId
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    if (!this.name) {
      throw new Error('Name should not be empty')
    }

    if (!this.path) {
      throw new Error('Path should not be empty')
    }

    if (!this.size) {
      throw new Error('Size should not be empty')
    }

    if (!this.extension) {
      throw new Error('Extension should not be empty')
    }

    if (!this.userId) {
      throw new Error('User ID should not be empty')
    }

    if (this.size < 0) {
      throw new Error('Size should be greater than 0')
    }
  }
}
