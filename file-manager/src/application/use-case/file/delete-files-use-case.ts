import { v4 as uuid } from 'uuid'
import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCaseResponse,
  type UseCase,
  type DeleteFileUseCaseParams,
} from '../../interface'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository,
  type MessageSender,
} from '../../protocol'

export class DeleteFilesUseCase implements UseCase {
  constructor(
    private readonly getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
    private readonly deleteFilesRepository: DeleteFilesRepository,
    private readonly deleteFilesFromStorageSender: MessageSender,
  ) {}

  async execute(
    params: DeleteFileUseCaseParams,
  ): Promise<UseCaseResponse<null>> {
    const files =
      await this.getFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId(
        params.filesIds,
        params.albumId,
        params.userId,
      )

    if (!files || files.length === 0) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND,
      }
    }

    await this.deleteFilesRepository.deleteFiles(files)

    await this.deleteFilesFromStorageSender.send({
      id: uuid(),
      filesIds: params.filesIds,
      userId: params.userId,
      date: new Date(),
    })

    return {
      ok: true,
    }
  }
}
