export interface DeleteRefreshTokenByIdRepository {
  delete: (id: string) => Promise<void>
}
