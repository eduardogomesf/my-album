import { type OutboxType, type Outbox } from '@prisma/client'

export interface UpdateOneOutboxRepositoryParams {
  id: string
  lastAttemptedAt?: Date
  retryCount?: number
}

export interface UpdateManyOutboxRepositoryParams {
  ids: string[]
  lastAttemptedAt?: Date
}

export interface UpdateOneByIdOutboxRepository {
  updateOneById: (params: UpdateOneOutboxRepositoryParams) => Promise<boolean>
}

export interface GetOneByAggregateIdAndTypeOutboxRepository {
  getByAggregateIdAndType: (id: string, type: OutboxType) => Promise<Outbox | null>
}

export interface GetManyByAggregateIdsAndTypeOutboxRepository {
  getManyByAggregateIdsAndType: (ids: string[], type: OutboxType) => Promise<Outbox[]>
}

export interface DeleteOneByIdOutboxRepository {
  deleteOneById: (id: string) => Promise<boolean>
}

export interface DeleteManyByIdsOutboxRepository {
  deleteManyByIds: (ids: string[]) => Promise<boolean>
}

export interface UpdateManyByIdsOutboxRepository {
  updateManyByIds: (params: UpdateManyOutboxRepositoryParams) => Promise<boolean>
}
