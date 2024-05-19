import { Schema, model } from 'mongoose'
import { MongoConnectionManager } from '../client'
import { ENVS } from '@/shared'

const UserSchema = new Schema({
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
}, { timestamps: true })

UserSchema.virtual('id').get(function() {
  return this._id.toString()
})

UserSchema.set('toJSON', {
  virtuals: true
})

const connection = MongoConnectionManager.getOrCreate(
  ENVS.MONGO.CONNECTION_NAME,
  ENVS.MONGO.URL,
  ENVS.MONGO.DB_NAME,
  {}
)

export const UserModel = model('User', UserSchema, 'users', {
  connection
})
