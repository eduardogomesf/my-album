import { MissingFieldsHelper } from '@/shared/helper'
import { BaseEntity } from './base.entity'
import { DomainError } from './domain-error.entity'

interface CreateFileDTO {
  id?: string
  name: string
  path: string
  size: number
  extension: string
  userId: string
  url?: string
  createdAt?: string
  updatedAt?: string
}

export class File extends BaseEntity {
  name: string
  path: string
  size: number
  extension: string
  userId: string
  url?: string | null
  createdAt: string | null
  updatedAt: string | null

  constructor(data: CreateFileDTO) {
    super(data.id)
    this.name = data.name
    this.path = data.path
    this.size = data.size
    this.extension = data.extension
    this.userId = data.userId
    this.url = data.url ?? null
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
      ['name', 'path', 'size', 'extension', 'userId'],
      this
    )

    if (missingFieldsValidation.isMissing) {
      throw new DomainError(missingFieldsValidation.message)
    }

    if (this.size < 0) {
      throw new DomainError('Size should be greater than 0')
    }
  }
}
