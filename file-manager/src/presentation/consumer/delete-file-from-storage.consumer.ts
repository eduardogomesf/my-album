import { type Consumer } from 'kafkajs'
import { Logger } from '@/shared'
import { type DeleteFilesFromStorageUseCase } from '@/application/use-case'
import { type DeleteFileFromStorageDTO } from '../dto'
import { MessageConsumer } from '../interface/message-consumer'

export class DeleteFilesFromStorageEventConsumer implements MessageConsumer {
  private logger = new Logger(DeleteFilesFromStorageEventConsumer.name)

  constructor(
    private readonly deleteFilesFromStorageUseCase: DeleteFilesFromStorageUseCase,
    private readonly kafkaConsumer: Consumer
  ) {}

  private isValid(payload: DeleteFileFromStorageDTO) {
    const missingFields = []

    if (!payload.filesIds || !payload.filesIds.length) {
      missingFields.push('filesIds')
    }

    if (!payload.userId) {
      missingFields.push('userId')
    }

    if (!payload.date) {
      missingFields.push('date')
    }

    return missingFields.length === 0
  }

  async start(): Promise<void> {
    await this.kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const dataFromBuffer = message?.value?.toString() ?? '{}'

        const parsedData: DeleteFileFromStorageDTO = JSON.parse(dataFromBuffer)

        this.logger.info('Delete files from storage request received: ', parsedData.id)

        const isValid = this.isValid(parsedData)

        if (!isValid) {
          this.logger.error(`Invalid data: ${JSON.stringify(parsedData)}`, parsedData.id)
          return
        }

        await this.deleteFilesFromStorageUseCase.execute({
          ...parsedData
        })

        this.logger.info('Deletes files from storage successfully', parsedData.id)
      }
    })
  }
}
