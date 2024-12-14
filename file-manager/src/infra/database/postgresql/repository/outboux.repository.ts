import { type Outbox, type OutboxType } from '@prisma/client'
import {
  type UpdateOneOutboxRepositoryParams,
  type DeleteOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type UpdateOneByIdOutboxRepository,
  type DeleteManyByIdsOutboxRepository,
  type UpdateManyByIdsOutboxRepository,
  type UpdateManyOutboxRepositoryParams,
  type GetManyByAggregateIdsAndTypeOutboxRepository,
} from '../../../object-storage/interface'
import { prisma } from '../client'
import { Logger } from '@/shared'

export class PrismaOutboxRepository
  implements
    GetOneByAggregateIdAndTypeOutboxRepository,
    UpdateOneByIdOutboxRepository,
    DeleteOneByIdOutboxRepository,
    DeleteManyByIdsOutboxRepository,
    UpdateManyByIdsOutboxRepository,
    GetManyByAggregateIdsAndTypeOutboxRepository
{
  private readonly logger = new Logger(PrismaOutboxRepository.name)

  async getByAggregateIdAndType(
    id: string,
    type: OutboxType,
  ): Promise<Outbox | null> {
    try {
      return await prisma.outbox.findFirst({
        where: { aggregateId: id, type },
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async getManyByAggregateIdsAndType(
    ids: string[],
    type: OutboxType,
  ): Promise<Outbox[]> {
    try {
      return await prisma.outbox.findMany({
        where: {
          aggregateId: {
            in: ids,
          },
          type,
        },
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async updateOneById(
    params: UpdateOneOutboxRepositoryParams,
  ): Promise<boolean> {
    try {
      return !!(await prisma.outbox.update({
        where: { id: params.id },
        data: {
          lastAttemptedAt: params.lastAttemptedAt,
          retryCount: params.retryCount,
        },
      }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async deleteOneById(id: string): Promise<boolean> {
    try {
      return !!(await prisma.outbox.delete({ where: { id } }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async deleteManyByIds(ids: string[]): Promise<boolean> {
    try {
      return !!(await prisma.outbox.deleteMany({ where: { id: { in: ids } } }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async updateManyByIds(
    params: UpdateManyOutboxRepositoryParams,
  ): Promise<boolean> {
    try {
      return !!(await prisma.outbox.updateMany({
        where: { id: { in: params.ids } },
        data: {
          lastAttemptedAt: params.lastAttemptedAt,
          retryCount: { increment: 1 },
        },
      }))
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
