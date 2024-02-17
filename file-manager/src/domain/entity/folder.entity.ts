import { MissingFieldsHelper } from '@/shared/helper'
import { BaseEntity } from './base.entity'
import { DomainError } from './domain-error.entity'

interface CreateFolderDto {
  id?: string
  name: string
  parentId: string | null
  userId: string
  isDeleted: boolean
  createdAt?: string
  updatedAt?: string
}

export class Folder extends BaseEntity {
  name: string
  parentId: string | null
  userId: string
  isDeleted: boolean
  createdAt?: string | null
  updatedAt?: string | null

  constructor(data: CreateFolderDto) {
    super(data.id)
    this.name = data.name
    this.parentId = data.parentId
    this.userId = data.userId
    this.isDeleted = data.isDeleted ?? false
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
      ['name', 'parentId', 'userId', 'isDeleted'],
      this
    )

    if (missingFieldsValidation.isMissing) {
      throw new DomainError(missingFieldsValidation.message)
    }

    if (this.name.length < 5 || this.name.length > 50) {
      throw new DomainError('Name must be between 5 and 50 characters')
    }
  }
}
