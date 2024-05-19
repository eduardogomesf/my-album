import { BaseEntity } from './base.entity'

interface CreateUnpublishedMessageDto {
  id: string
  data: Record<string, any>
  hasError?: boolean
  error?: string
  options: Record<string, any> & { topic: string }
  createdAt: Date
  updatedAt: Date
}

export class UnpublishedMessage extends BaseEntity {
  id: string
  data: Record<string, any>
  hasError?: boolean
  error?: string
  options: Record<string, any>
  createdAt: Date
  updatedAt: Date

  constructor(dto: CreateUnpublishedMessageDto) {
    super(dto.id)
    this.data = dto.data
    this.hasError = dto.hasError ?? false
    this.error = dto.error ?? ''
    this.options = dto.options
    this.createdAt = dto.createdAt
    this.updatedAt = dto.updatedAt
  }
}
