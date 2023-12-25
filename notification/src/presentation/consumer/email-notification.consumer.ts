import { type SendEmailNotificationUseCase } from '@/application/use-case'
import { type Consumer } from 'kafkajs'
import { Logger } from '../../shared'
import { type EmailNotificationDTO } from '../dto'

const logger = new Logger('EmailNotificationEventConsumer')

export class EmailNotificationEventConsumer {
  constructor(
    private readonly sendEmailNotificationUseCase: SendEmailNotificationUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message, topic, partition }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: EmailNotificationDTO = JSON.parse(dataFromBuffer)

        logger.info(`Message with id ${parsedData.id} received from ${topic} topic and ${partition} partition`)

        await this.sendEmailNotificationUseCase.send({
          body: parsedData.body,
          sourceEmail: parsedData.sourceEmail,
          subject: parsedData.subject,
          targetEmail: parsedData.targetEmail,
          tags: parsedData.tags,
          timestamp: parsedData.timestamp
        })
      }
    })
  }
}
