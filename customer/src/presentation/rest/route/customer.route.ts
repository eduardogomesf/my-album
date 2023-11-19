import { Router } from 'express'

import { type UseCases } from '../../interface/use-cases'
import { CustomerController } from '../controller/customer.controller'

export function getCustomerRouter(useCases: UseCases): Router {
  const router = Router()

  const customerController = new CustomerController(useCases.createNewCustomer, useCases.customerLogin)

  router.post('/customers', customerController.create.bind(customerController))

  router.post('/customers/login', customerController.login.bind(customerController))

  return router
}
