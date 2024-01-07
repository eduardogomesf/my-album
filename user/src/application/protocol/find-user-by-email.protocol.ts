import { type User } from '@/domain/entity/user.entity'

export interface FindUserByEmailRepository {
  findByEmail: (email: string) => Promise<User | null>
}
