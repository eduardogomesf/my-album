import { type Injections } from '../interface/injections'
import { AddNewUserEventConsumer } from './add-new-user.consumer'

export const setupConsumers = (dependencies: Injections) => {
  const consumers = [
    new AddNewUserEventConsumer(
      dependencies.addNewUserUseCase,
      dependencies.addNewUseKafkaConsumer
    )
  ]

  return {
    start: async () => {
      await Promise.all(consumers.map(async consumer => { await consumer.start() }))
    }
  }
}
