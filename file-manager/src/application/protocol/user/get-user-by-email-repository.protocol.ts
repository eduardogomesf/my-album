import { type User } from '@/domain/entity'

export interface GetUserByEmailRepository {
  getByEmail: (email: string) => Promise<User | null>
}
