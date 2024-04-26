import { type RefreshToken } from './save-refresh-token.protocol'

export interface GetRefreshTokenByTokenAndUserIdRepository {
  getByTokenAndUserId: (token: string, userId: string) => Promise<RefreshToken | null>
}
