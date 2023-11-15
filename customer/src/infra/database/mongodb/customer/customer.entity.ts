import { Schema, model } from 'mongoose'
import { type Customer } from '../../../../domain/entity/customer.entity'

const CustomerSchema = new Schema<Customer>({
  id: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cellphone: {
    type: String,
    required: true
  }
})

export const CustomerModel = model('Customer', CustomerSchema, 'customers')
