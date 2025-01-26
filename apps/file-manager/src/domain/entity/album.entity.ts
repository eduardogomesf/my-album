import { MissingFieldsHelper } from '@/shared/helper'
import { BaseEntity } from './base.entity'
import { DomainError } from './domain-error.entity'
import { AlbumStatus } from '../enum'

interface CreateAlbumDto {
  id?: string
  name: string
  userId: string
  status: AlbumStatus
  createdAt?: Date
  updatedAt?: Date
}

export class Album extends BaseEntity {
  name: string
  userId: string
  status: AlbumStatus
  createdAt?: Date | null
  updatedAt?: Date | null

  constructor(data: CreateAlbumDto) {
    super(data.id)
    this.name = data.name
    this.userId = data.userId
    this.status = data.status ?? AlbumStatus.ACTIVE
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
      ['name', 'userId'],
      this,
    )

    if (missingFieldsValidation.isMissing) {
      throw new DomainError(missingFieldsValidation.message)
    }

    if (this.name.length < 2 || this.name.length > 50) {
      throw new DomainError('Name must be between 2 and 50 characters')
    }
  }
}
