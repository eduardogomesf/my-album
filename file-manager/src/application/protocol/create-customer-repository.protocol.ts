import { type Customer } from '@/domain/entity'

export interface CreateCustomerRepository {
  create: (customer: Customer) => Promise<void>
}
