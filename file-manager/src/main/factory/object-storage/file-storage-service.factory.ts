import { S3FileStorage } from '@/infra/object-storage'
import {
  type UpdateOneByIdOutboxRepository,
  type GetOneByAggregateIdAndTypeOutboxRepository,
  type DeleteOneByIdOutboxRepository
} from '@/infra/object-storage/interface'

export const generateFileStorageService = (
  updateOneByIdOutboxRepository: UpdateOneByIdOutboxRepository,
  getOneByAggregateIdAndTypeOutboxRepository: GetOneByAggregateIdAndTypeOutboxRepository,
  deleteOneByIdOutboxRepository: DeleteOneByIdOutboxRepository
) => {
  return new S3FileStorage(
    updateOneByIdOutboxRepository,
    getOneByAggregateIdAndTypeOutboxRepository,
    deleteOneByIdOutboxRepository
  )
}
