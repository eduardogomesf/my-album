import { MissingFieldsHelper } from '@/shared/helper'
import { BaseEntity } from './base.entity'
import { DomainError } from './domain-error.entity'

interface CreateAlbumDto {
  id?: string
  name: string
  userId: string
  isMain: boolean
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class Album extends BaseEntity {
  name: string
  userId: string
  isMain: boolean
  isDeleted: boolean
  createdAt?: Date | null
  updatedAt?: Date | null

  constructor(data: CreateAlbumDto) {
    super(data.id)
    this.name = data.name
    this.userId = data.userId
    this.isMain = data.isMain ?? false
    this.isDeleted = data.isDeleted ?? false
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
      ['name', 'userId', 'isMain'],
      this
    )

    if (missingFieldsValidation.isMissing) {
      throw new DomainError(missingFieldsValidation.message)
    }

    if (this.name.length < 2 || this.name.length > 50) {
      throw new DomainError('Name must be between 2 and 50 characters')
    }
  }
}
