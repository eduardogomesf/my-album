import { type Consumer } from 'kafkajs'
import { Logger } from '@/shared'
import { type AddNewCustomerUseCase } from '@/application/use-case'
import { type AddNewCustomerDTO } from '../dto'

const logger = new Logger('AddNewCustomerEventConsumer')

export class AddNewCustomerEventConsumer {
  constructor(
    private readonly addNewCustomerUseCase: AddNewCustomerUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: AddNewCustomerDTO = JSON.parse(dataFromBuffer)

        logger.info(`Message with id ${parsedData.id} received from ${topic} topic and ${partition} partition`)

        await this.addNewCustomerUseCase.execute({
          id: parsedData.id,
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          email: parsedData.email
        })
      }
    })
  }
}
