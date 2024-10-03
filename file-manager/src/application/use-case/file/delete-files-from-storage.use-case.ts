import {
  type UseCaseResponse,
  type UseCase,
  type DeleteFileFromStorageUseCaseParams
} from '../../interface'
import {
  DeleteFilesFromStorageService,
  MessageSender
} from '../../protocol'

export class DeleteFilesFromStorageUseCase implements UseCase {
  constructor(
    private readonly deleteFilesFromStorageService: DeleteFilesFromStorageService,
    private readonly deleteFilesFromStorageSender: MessageSender,
  ) {}

  async execute(params: DeleteFileFromStorageUseCaseParams): Promise<UseCaseResponse<null>> {
    const wasDeleted = await this.deleteFilesFromStorageService.deleteMany(
      params.filesIds,
      params.userId
    )

    if (!wasDeleted) {
      const newMessage = { ...params }

      newMessage.lastAttempt = new Date().toString()
      newMessage.retryCount = newMessage.retryCount ? newMessage.retryCount + 1 : 1

      await this.deleteFilesFromStorageSender.send(newMessage)
    }

    return {
      ok: wasDeleted
    }
  }
}
