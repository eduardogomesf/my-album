import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCaseResponse,
  type UseCase,
  type DeleteFileUseCaseParams
} from '../../interface'
import {
  type GetFilesByIdsAndAlbumIdRepository,
  type DeleteFilesRepository,
  type DeleteFileFromStorageService
} from '../../protocol'

export class DeleteFilesUseCase implements UseCase {
  constructor(
    private readonly getFilesByIdsAndAlbumIdRepository: GetFilesByIdsAndAlbumIdRepository,
    private readonly deleteFilesRepository: DeleteFilesRepository,
    private readonly deleteFileFromStorageService: DeleteFileFromStorageService
  ) {}

  async execute(params: DeleteFileUseCaseParams): Promise<UseCaseResponse<null>> {
    const files = await this.getFilesByIdsAndAlbumIdRepository.getFilesByIdsAndAlbumId(
      params.filesIds,
      params.albumId,
      params.userId
    )

    if (!files || files.length === 0) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.MANY_NOT_FOUND
      }
    }

    await this.deleteFilesRepository.deleteFiles(files)

    for (const file of files) {
      await this.deleteFileFromStorageService.delete(file, params.userId)
    }

    return {
      ok: true
    }
  }
}
