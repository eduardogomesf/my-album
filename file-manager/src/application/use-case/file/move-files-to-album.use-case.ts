import { ERROR_MESSAGES } from '../../constant'
import { type UseCaseResponse, type UseCase } from '../../interface'
import { type GetFilesByIdsRepository, type GetAlbumByIdRepository, type UpdateFileRepository } from '../../protocol'

interface MoveFilesToAlbumRequest {
  sourceAlbumId: string
  destinationAlbumId: string
  fileIds: string[]
  userId: string
}

export class MoveFilesToAlbumUseCase implements UseCase {
  constructor(
    private readonly getAlbumByIdRepository: GetAlbumByIdRepository,
    private readonly getFilesByIdsRepository: GetFilesByIdsRepository,
    private readonly updateFileRepository: UpdateFileRepository
  ) {}

  async execute(request: MoveFilesToAlbumRequest): Promise<UseCaseResponse> {
    const [sourceAlbum, destinationAlbum] = await Promise.all([
      this.getAlbumByIdRepository.getById(request.sourceAlbumId, request.userId),
      this.getAlbumByIdRepository.getById(request.destinationAlbumId, request.userId)
    ])

    if (!sourceAlbum || sourceAlbum.isDeleted) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.SOURCE_ALBUM_NOT_FOUND
      }
    }

    if (!destinationAlbum || destinationAlbum.isDeleted) {
      return {
        ok: false,
        message: ERROR_MESSAGES.ALBUM.DESTINATION_ALBUM_NOT_FOUND
      }
    }

    const files = await this.getFilesByIdsRepository.getByIds(request.fileIds, request.sourceAlbumId)

    await Promise.all(files.map(async file => {
      file.albumId = request.destinationAlbumId
      await this.updateFileRepository.update(file)
    }))

    return {
      ok: true,
      data: null
    }
  }
}
