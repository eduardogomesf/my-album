import { type Customer } from '../../../domain/entity/customer.entity'

export interface FindCustomerByEmailRepository {
  findByEmail: (email: string) => Promise<Customer>
}
