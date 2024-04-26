export interface RefreshToken {
  id: string
  token: string
  userId: string
}

export interface SaveRefreshTokenRepository {
  save: (data: RefreshToken) => Promise<void>
}
