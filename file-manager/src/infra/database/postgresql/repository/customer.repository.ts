import { type GetCustomerByEmailRepository, type CreateCustomerRepository } from '@/application/protocol'
import { Logger } from '@/shared'
import { Customer } from '@/domain/entity'
import { prisma } from '../client'

const logger = new Logger('PrismaCustomerRepository')

export class PrismaCustomerRepository implements GetCustomerByEmailRepository, CreateCustomerRepository {
  async getByEmail(email: string): Promise<Customer | null> {
    try {
      const customer = await prisma.customer.findUnique({
        where: {
          email
        }
      })
      return customer ? new Customer(customer) : null
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }

  async create(customer: Customer): Promise<void> {
    try {
      await prisma.customer.create({
        data: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email
        }
      })
    } catch (error) {
      logger.error(error.message)
      throw new Error(error)
    }
  }
}
