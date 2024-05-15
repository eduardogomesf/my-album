import {
  type FindUserByEmailRepository,
  type CreateUserRepository,
  type UserExistsRepository,
  type FindUserByIdRepository
} from '@/application/protocol'
import { User } from '@/domain/entity/user.entity'
import { Logger } from '@/shared'
import { UserModel } from './user.entity'

const logger = new Logger('MongoUserRepository')

export class MongoUserRepository implements FindUserByEmailRepository, CreateUserRepository, UserExistsRepository, FindUserByIdRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne<User>({ email })

      if (!user) {
        return null
      }

      return new User(user)
    } catch (error) {
      logger.error('Error finding user by email')
      logger.error(error)
      throw error
    }
  }

  async create(user: User): Promise<void> {
    try {
      const userData = {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cellphone: user.cellphone,
        password: user.password
      }

      await UserModel.create(userData)
    } catch (error) {
      logger.error('Error creating user')
      logger.error(error)
      throw error
    }
  }

  async exists(userId: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne<User>({ _id: userId })
      return !!user
    } catch (error) {
      logger.error('Error finding user by user id')
      logger.error(error)
      throw error
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById<User>(id)

      if (!user) {
        return null
      }

      return new User(user)
    } catch (error) {
      logger.error('Error finding user by id')
      logger.error(error)
      throw error
    }
  }
}
