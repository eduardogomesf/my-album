import { Schema, model } from 'mongoose'
import { MongoConnectionManager } from '../client'
import { ENVS } from '@/shared'

const RefreshToken = new Schema({
  _id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

RefreshToken.virtual('id').get(function() {
  return this._id.toString()
})

RefreshToken.set('toJSON', {
  virtuals: true
})

const connection = MongoConnectionManager.getOrCreate(
  ENVS.MONGO.CONNECTION_NAME,
  ENVS.MONGO.URL,
  ENVS.MONGO.DB_NAME,
  {}
)

export const RefreshTokenModel = model('RefreshToken', RefreshToken, 'refresh_tokens', {
  connection
})
