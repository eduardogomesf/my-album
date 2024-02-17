import { type Folder } from '@/domain/entity'

export interface GetFolderByIdRepository {
  getById: (id: string) => Promise<Folder>
}
