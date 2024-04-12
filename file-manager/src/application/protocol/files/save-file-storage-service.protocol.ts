export interface SaveFileStorageServiceDTO {
  fileId: string
  content: Buffer
  name: string
  encoding: string
  type: string
  userId: string
}

export interface SaveFileStorageService {
  save: (params: SaveFileStorageServiceDTO) => Promise<null>
}
