import { Schema, model } from 'mongoose'

const CustomerSchema = new Schema({
  _id: {
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
  },
  password: {
    type: String,
    required: true
  }
})

CustomerSchema.virtual('id').get(function() {
  return this._id.toString()
})

CustomerSchema.set('toJSON', {
  virtuals: true
})

export const CustomerModel = model('Customer', CustomerSchema, 'customers')
