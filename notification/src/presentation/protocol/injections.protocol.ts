import { type Consumer } from 'kafkajs'
import { type SendEmailNotificationUseCase } from '@/application/use-case'

export interface Injections {
  sendEmailNotificationUseCase: SendEmailNotificationUseCase
  kafkaConsumer: Consumer
}
