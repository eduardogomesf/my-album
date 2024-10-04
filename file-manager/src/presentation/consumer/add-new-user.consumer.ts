import { type Consumer } from 'kafkajs'
import { Logger } from '@/shared'
import { type AddNewUserUseCase } from '@/application/use-case'
import { type AddNewUserDTO } from '../dto'
import { MessageConsumer } from '../interface/message-consumer'

const logger = new Logger('AddNewUserEventConsumer')

export class AddNewUserEventConsumer implements MessageConsumer {
  constructor(
    private readonly addNewUserUseCase: AddNewUserUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  private isValid(payload: any) {
    const missingFields = []

    if (!payload.id) {
      missingFields.push('id')
    }

    if (!payload.firstName) {
      missingFields.push('firstName')
    }

    if (!payload.lastName) {
      missingFields.push('lastName')
    }

    if (!payload.email) {
      missingFields.push('email')
    }

    return missingFields.length === 0
  }

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: AddNewUserDTO = JSON.parse(dataFromBuffer)

        logger.info('New user request received', parsedData.id)

        const isValid = this.isValid(parsedData)

        if (!isValid) {
          logger.error(`Invalid data: ${JSON.stringify(parsedData)}`, parsedData.id)
          return
        }

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
