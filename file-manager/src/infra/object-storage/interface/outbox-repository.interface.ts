import { type OutboxType, type Outbox } from '@prisma/client'

export interface UpdateOneOutboxRepositoryParams {
  id: string
  lastAttemptedAt?: Date
  retryCount?: number
}

export interface UpdateOneByIdOutboxRepository {
  updateOneById: (params: UpdateOneOutboxRepositoryParams) => Promise<boolean>
}

export interface GetOneByAggregateIdAndTypeOutboxRepository {
  getByAggregateIdAndType: (id: string, type: OutboxType) => Promise<Outbox | null>
}

export interface DeleteOneByIdOutboxRepository {
  deleteOneById: (id: string) => Promise<boolean>
}
