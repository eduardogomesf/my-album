import * as cron from 'node-cron'
import { type ReprocessUnpublishedMessages } from '@/use-case'
import { ENVS } from '@/shared'
import { type Job } from './interface'

export class ReprocessUnpublishedMessagesJob implements Job {
  constructor(private readonly reprocessUnpublishedMessagesUseCase: ReprocessUnpublishedMessages) {}

  start() {
    cron.schedule(
      ENVS.JOBS.SCHEDULES.REPROCESS_UNPUBLISHED_MESSAGES,
      this.execute.bind(this)
    )
  }

  async execute() {
    await this.reprocessUnpublishedMessagesUseCase.execute()
  }
}
