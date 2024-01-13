export interface GetCurrentStorageUsageRepositoryResponse {
  usage: number
}

export interface GetCurrentStorageUsageRepository {
  get: (userId: string) => Promise<GetCurrentStorageUsageRepositoryResponse>
}
