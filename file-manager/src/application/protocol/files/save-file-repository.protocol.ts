import { type File } from '@/domain/entity'

export interface SaveFileRepository {
  save: (file: File) => Promise<void>
}
