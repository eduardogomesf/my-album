import { type Consumer } from 'kafkajs'
import { Logger } from '@/shared'
import { type AddNewUserUseCase } from '@/application/use-case'
import { type AddNewUserDTO } from '../dto'

const logger = new Logger('AddNewUserEventConsumer')

export class AddNewUserEventConsumer {
  constructor(
    private readonly addNewUserUseCase: AddNewUserUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: AddNewUserDTO = JSON.parse(dataFromBuffer)

        logger.info(`Message with id ${parsedData.id} received from ${topic} topic and ${partition} partition`)

        await this.addNewUserUseCase.execute({
          id: parsedData.id,
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          email: parsedData.email
        })
      }
    })
  }
}
