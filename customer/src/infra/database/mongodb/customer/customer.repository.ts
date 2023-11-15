import { type FindCustomerByEmailRepository, type CreateCustomerRepository } from '../../../../application/protocol'
import { Customer } from '../../../../domain/entity/customer.entity'
import { CustomerModel } from './customer.entity'

export class MongoCustomerRepository implements FindCustomerByEmailRepository, CreateCustomerRepository {
  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const customer = await CustomerModel.findOne<Customer>({ email })

      if (!customer) {
        return null
      }

      return new Customer(customer)
    } catch (error) {
      console.error('Error finding customer by email')
      console.error(error)
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
      console.error('Error creating customer')
      console.error(error)
      throw error
    }
  }
}
