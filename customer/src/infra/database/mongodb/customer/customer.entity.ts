import { Schema, model } from 'mongoose'
import { MongoConnectionManager } from '../client'
import { ENVS } from '../../../../shared'

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

const connection = MongoConnectionManager.getOrCreate(
  ENVS.MONGO.CONNECTION_NAME,
  ENVS.MONGO.URL,
  ENVS.MONGO.DB_NAME,
  {}
)

export const CustomerModel = model('Customer', CustomerSchema, 'customers', {
  connection
})
