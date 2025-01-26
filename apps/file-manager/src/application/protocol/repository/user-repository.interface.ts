import { type User } from '@/domain/entity'

export interface CreateUserRepository {
  create: (user: User) => Promise<void>
}

export interface GetUserByEmailRepository {
  getByEmail: (email: string) => Promise<User | null>
}

export interface GetUserByIdRepository {
  getById: (userId: string) => Promise<User | null>
}
