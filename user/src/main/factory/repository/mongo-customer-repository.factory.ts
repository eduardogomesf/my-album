import { MongoCustomerRepository } from '@/infra/database/mongodb/customer/customer.repository'

export function generateMongoCustomerRepository() {
  return new MongoCustomerRepository()
}
