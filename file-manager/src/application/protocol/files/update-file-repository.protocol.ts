import { type File } from '@/domain/entity'

export interface UpdateFileRepository {
  update: (file: File) => Promise<void>
}
