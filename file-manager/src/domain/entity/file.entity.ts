import { MissingFieldsHelper } from '@/shared/helper'
import { BaseEntity } from './base.entity'
import { DomainError } from './domain-error.entity'

interface CreateFileDTO {
  id?: string
  name: string
  size: number
  encoding: string
  type: string
  mimeType: string
  contentHash: string
  extension: string
  albumId: string
  uploaded: boolean
  createdAt?: Date
  updatedAt?: Date
}

export class File extends BaseEntity {
  name: string
  size: number
  encoding: string
  type: string
  mimeType: string
  contentHash: string
  extension: string
  albumId: string
  uploaded: boolean
  createdAt: Date | null
  updatedAt: Date | null

  constructor(data: CreateFileDTO) {
    super(data.id)
    this.name = data.name
    this.size = data.size
    this.encoding = data.encoding
    this.type = data.type
    this.mimeType = data.mimeType
    this.contentHash = data.contentHash
    this.extension = data.extension
    this.albumId = data.albumId
    this.uploaded = data.uploaded ?? false
    this.createdAt = data.createdAt ?? null
    this.updatedAt = data.updatedAt ?? null

    this.validate()
  }

  private validate() {
    const missingFieldsValidation = MissingFieldsHelper.hasMissingFields(
      ['name', 'size', 'extension', 'type', 'encoding', 'albumId', 'mimeType', 'contentHash'],
      this
    )

    if (missingFieldsValidation.isMissing) {
      throw new DomainError(missingFieldsValidation.message)
    }

    if (this.size <= 0) {
      throw new DomainError('Size should be greater than 0')
    }
  }
}
