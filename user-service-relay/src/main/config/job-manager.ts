import { ReprocessUnpublishedMessagesJob } from '@/infra/job'
import { Logger } from '@/shared'
import { type UseCases } from './use-cases'

export const startJobs = (useCases: UseCases) => {
  const logger = new Logger('job-manager')

  logger.info('Starting jobs...')

  const jobs = [
    new ReprocessUnpublishedMessagesJob(useCases.reprocessUnpublishedMessagesUseCase)
  ]

  jobs.forEach(job => { job.start() })

  logger.info('Jobs started')
}
