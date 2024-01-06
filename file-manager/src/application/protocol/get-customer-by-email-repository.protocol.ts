import { type Customer } from '@/domain/entity'

export interface GetCustomerByEmailRepository {
  getByEmail: (email: string) => Promise<Customer | null>
}
