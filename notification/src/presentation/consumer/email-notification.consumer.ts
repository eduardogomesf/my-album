import { type SendEmailNotificationUseCase } from '@/application/use-case'
import { type Consumer } from 'kafkajs'
import { Logger } from '../../shared'

export class EmailNotificationEventConsumer {
  constructor(
    private readonly sendEmailNotificationUseCase: SendEmailNotificationUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const messageWithMetadata = {
          topic,
          partition,
          offset: message?.offset,
          message: dataFromBuffer
        }

        Logger.info(`Message read: ${JSON.stringify(messageWithMetadata)}`)

        const parsedData = JSON.parse(dataFromBuffer)

        console.log(parsedData)

        // await this.sendEmailNotificationUseCase.send({
        //   email,
        //   message: notificationMessage
        // })
      }
    })
  }
}
