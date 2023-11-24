import { connect, type Connection, type Channel } from 'amqplib'
import { ENVS } from '../../../shared'

export let rabbitMQConnection: Connection = null as any
export let rabbitMQChannel: Channel = null as any

export async function generateRabbitMQConnectionAndMainChannel() {
  if (rabbitMQConnection && rabbitMQChannel) {
    console.log('RabbitMQ connection and channel already exists')

    return {
      connection: rabbitMQConnection,
      channel: rabbitMQChannel
    }
  }

  console.log('Connecting to RabbitMQ...')
  rabbitMQConnection = await connect(ENVS.RABBIT_MQ.URL)
  console.log('Connected to RabbitMQ...')

  rabbitMQChannel = await rabbitMQConnection.createChannel()

  return {
    connection: rabbitMQConnection,
    channel: rabbitMQChannel
  }
}
