import { type User } from '@/domain/entity'

export interface CreateUserRepository {
  create: (user: any) => Promise<void>
}

export interface FindUserByEmailRepository {
  findByEmail: (email: string) => Promise<User | null>
}

export interface UserExistsRepository {
  exists: (userId: string) => Promise<boolean>
}

export interface FindUserByIdRepository {
  findById: (id: string) => Promise<User | null>
}
