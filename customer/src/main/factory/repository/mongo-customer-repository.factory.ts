import { MongoCustomerRepository } from '../../../infra/database/mongodb/main/customer/customer.repository'

export function generateMongoCustomerRepository() {
  return new MongoCustomerRepository()
}
