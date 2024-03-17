import { type GetUserByEmailRepository, type CreateUserRepository, type GetUserByIdRepository } from '@/application/protocol'
import { Logger } from '@/shared'
import { User } from '@/domain/entity'
import { prisma } from '../client'

const logger = new Logger('PrismaUserRepository')

export class PrismaUserRepository implements GetUserByEmailRepository, CreateUserRepository, GetUserByIdRepository {
  async getByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })
      return user ? new User(user) : null
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async create(user: User): Promise<void> {
    try {
      await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async getById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId
        }
      })
      return user ? new User(user) : null
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
