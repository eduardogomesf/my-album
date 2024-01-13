interface SaveFileStorageServiceDTO {
  content: Buffer
  name: string
  encoding: string
  type: string
  userId: string
}

export interface SaveFileStorageService {
  save: (params: SaveFileStorageServiceDTO) => Promise<{ url: string }>
}
