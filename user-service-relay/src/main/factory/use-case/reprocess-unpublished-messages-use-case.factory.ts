import { ReprocessUnpublishedMessages } from '@/use-case'
import {
  type DeleteUnpublishedMessageRepository,
  type GetPendingUnpublishedMessagesRepository,
  type MessageSender,
  type UpdateUnpublishedMessageRepository
} from '@/use-case/protocol'

export const generateReprocessUnpublishedMessagesUseCase = (
  getPendingUnpublishedMessagesRepository: GetPendingUnpublishedMessagesRepository,
  messageSender: MessageSender,
  deleteUnpublishedMessagesRepository: DeleteUnpublishedMessageRepository,
  updateUnpublishedMessagesRepository: UpdateUnpublishedMessageRepository
): ReprocessUnpublishedMessages => {
  return new ReprocessUnpublishedMessages(
    getPendingUnpublishedMessagesRepository,
    messageSender,
    deleteUnpublishedMessagesRepository,
    updateUnpublishedMessagesRepository
  )
}
