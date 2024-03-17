import { type User } from '@/domain/entity'

export interface CreateUserRepository {
  create: (user: User) => Promise<void>
}
