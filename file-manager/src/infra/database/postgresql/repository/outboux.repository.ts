import {
  type Outbox,
  type OutboxType
} from '@prisma/client'
import {
  type UpdateOneOutboxRepositoryParams,
  type DeleteOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type UpdateOneByIdOutboxRepository
} from '../../../object-storage/interface'
import { prisma } from '../client'
import { Logger } from '@/shared'

export class PrismaOutboxRepository
implements GetOneByAggregateIdAndTypeOutboxRepository, UpdateOneByIdOutboxRepository, DeleteOneByIdOutboxRepository {
  private readonly logger = new Logger(PrismaOutboxRepository.name)

  async getByAggregateIdAndType(id: string, type: OutboxType): Promise<Outbox | null> {
    try {
      return await prisma.outbox.findFirst({
        where: { aggregateId: id, type }
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async updateOneById(params: UpdateOneOutboxRepositoryParams): Promise<boolean> {
    try {
      return !!await prisma.outbox.update({
        where: { id: params.id },
        data: {
          lastAttemptedAt: params.lastAttemptedAt,
          retryCount: params.retryCount
        }
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async deleteOneById(id: string): Promise<boolean> {
    try {
      return !!await prisma.outbox.delete({ where: { id } })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
