import { Schema, model } from 'mongoose'
import { MongoConnectionManager } from '../client'
import { ENVS } from '@/shared'

const UnpublishedMessageSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  data: Schema.Types.Mixed,
  options: Schema.Types.Mixed,
  error: String,
  hasError: Boolean
}, { timestamps: true })

UnpublishedMessageSchema.virtual('id').get(function() {
  return this._id.toString()
})

UnpublishedMessageSchema.set('toJSON', {
  virtuals: true
})

const connection = MongoConnectionManager.getOrCreate(
  ENVS.MONGO.CONNECTION_NAME,
  ENVS.MONGO.URL,
  ENVS.MONGO.DB_NAME,
  {}
)

export const UnpublishedMessageModel = model('UnpublishedMessage', UnpublishedMessageSchema, 'unpublished_messages', {
  connection
})
