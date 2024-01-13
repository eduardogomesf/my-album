export interface SaveFileStorageService {
  save: (params: any) => Promise<{ url: string }>
}
