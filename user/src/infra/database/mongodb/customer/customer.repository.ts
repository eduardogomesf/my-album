import { type FindCustomerByEmailRepository, type CreateCustomerRepository } from '@/application/protocol'
import { Customer } from '@/domain/entity/customer.entity'
import { Logger } from '@/shared'
import { CustomerModel } from './customer.entity'

const logger = new Logger('MongoCustomerRepository')

export class MongoCustomerRepository implements FindCustomerByEmailRepository, CreateCustomerRepository {
  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const customer = await CustomerModel.findOne<Customer>({ email })

      if (!customer) {
        return null
      }

      return new Customer(customer)
    } catch (error) {
      logger.error('Error finding customer by email')
      logger.error(error)
      throw error
    }
  }

  async create(customer: Customer): Promise<void> {
    try {
      const customerData = {
        _id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        cellphone: customer.cellphone,
        password: customer.password
      }

      await CustomerModel.create(customerData)
    } catch (error) {
      logger.error('Error creating customer')
      logger.error(error)
      throw error
    }
  }
}
