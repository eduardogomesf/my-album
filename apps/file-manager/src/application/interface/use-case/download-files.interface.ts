import { type Archiver } from 'archiver'

export interface DownloadFilesUseCaseParams {
  filesIds: string[]
  albumId: string
  userId: string
  archiver: Archiver
}
