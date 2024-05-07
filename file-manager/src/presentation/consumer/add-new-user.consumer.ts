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
      eachMessage: async ({ message }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: AddNewUserDTO = JSON.parse(dataFromBuffer)

        logger.info('New user request received', parsedData.id)

        await this.addNewUserUseCase.execute({
          id: parsedData.id,
          firstName: parsedData.firstName,
          lastName: parsedData.lastName,
          email: parsedData.email
        })

        logger.info('New user added', parsedData.id)
      }
    })
  }
}
