export interface GetCurrentStorageUsageRepositoryResponse {
  usage: number
}

export interface GetCurrentStorageUsageRepository {
  getUsage: (userId: string) => Promise<GetCurrentStorageUsageRepositoryResponse>
}
