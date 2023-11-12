export interface CreateCustomerRepository {
  create: (customer: any) => Promise<void>
}
