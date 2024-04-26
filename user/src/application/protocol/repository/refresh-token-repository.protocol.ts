export interface RefreshToken {
  id: string
  token: string
  userId: string
}

export interface SaveRefreshTokenRepository {
  save: (data: RefreshToken) => Promise<void>
}

export interface DeleteRefreshTokenByIdRepository {
  delete: (id: string) => Promise<void>
}

export interface GetRefreshTokenByTokenAndUserIdRepository {
  getByTokenAndUserId: (token: string, userId: string) => Promise<RefreshToken | null>
}
