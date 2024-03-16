import { type User } from '@/domain/entity'

export interface GetUserByIdRepository {
  getById: (userId: string) => Promise<User>
}
