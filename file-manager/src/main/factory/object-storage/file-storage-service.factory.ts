import { S3FileStorage } from '@/infra/object-storage'
import {
  type UpdateOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type DeleteOneByIdOutboxRepository,
  type DeleteManyByIdsOutboxRepository,
  type GetManyByAggregateIdsAndTypeOutboxRepository,
  type UpdateManyByIdsOutboxRepository
} from '@/infra/object-storage/interface'

export const generateFileStorageService = (
  updateOneByIdOutboxRepository: UpdateOneByIdOutboxRepository,
  getOneByAggregateIdAndTypeOutboxRepository: GetOneByAggregateIdAndTypeOutboxRepository,
  deleteOneByIdOutboxRepository: DeleteOneByIdOutboxRepository,
  getManyByAggregateIdsAndTypeOutboxRepository: GetManyByAggregateIdsAndTypeOutboxRepository,
  deleteManyByIdsOutboxRepository: DeleteManyByIdsOutboxRepository,
  updateManyByIdsOutboxRepository: UpdateManyByIdsOutboxRepository,
) => {
  return new S3FileStorage(
    updateOneByIdOutboxRepository,
    getOneByAggregateIdAndTypeOutboxRepository,
    deleteOneByIdOutboxRepository,
    getManyByAggregateIdsAndTypeOutboxRepository,
    deleteManyByIdsOutboxRepository,
    updateManyByIdsOutboxRepository
  )
}
