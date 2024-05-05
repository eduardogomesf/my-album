import { ERROR_MESSAGES } from '../../constant'
import {
  type UseCaseResponse,
  type UseCase,
  type DeleteFileUseCaseParams
} from '../../interface'
import {
  type GetFileByIdAndAlbumIdRepository,
  type DeleteFileRepository,
  type DeleteFileFromStorageService
} from '../../protocol'

export class DeleteFileUseCase implements UseCase {
  constructor(
    private readonly getFileByIdAndAlbumIdRepository: GetFileByIdAndAlbumIdRepository,
    private readonly deleteFileRepository: DeleteFileRepository,
    private readonly deleteFileFromStorageService: DeleteFileFromStorageService
  ) {}

  async execute(params: DeleteFileUseCaseParams): Promise<UseCaseResponse<null>> {
    const file = await this.getFileByIdAndAlbumIdRepository.getFileByIdAndAlbumId(params.fileId, params.albumId, params.userId)

    if (!file) {
      return {
        ok: false,
        message: ERROR_MESSAGES.FILE.NOT_FOUND
      }
    }

    await this.deleteFileRepository.deleteFile(file)

    await this.deleteFileFromStorageService.delete(file, params.userId)

    return {
      ok: true
    }
  }
}
