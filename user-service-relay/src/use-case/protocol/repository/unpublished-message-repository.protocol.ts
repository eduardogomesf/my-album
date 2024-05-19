import { type UnpublishedMessage } from '@/entity'

export interface GetPendingUnpublishedMessagesRepository {
  findAllPending: () => Promise<UnpublishedMessage[]>
}

export interface DeleteUnpublishedMessageRepository {
  delete: (id: string) => Promise<void>
}

export interface UpdateUnpublishedMessageRepository {
  update: (message: UnpublishedMessage) => Promise<void>
}
