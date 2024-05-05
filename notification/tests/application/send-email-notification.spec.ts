import { SendEmailNotificationUseCase } from '@/application/use-case'
import { type EmailSender } from '@/application/protocol'

jest.mock('@/shared/env.ts', () => ({
  ENVS: {
    SMTP: {
      SOURCE_EMAILS: ['source@test.com']
    }
  }
}))

describe('Send Email Notification use case', () => {
  let sut: SendEmailNotificationUseCase
  let emailSender: EmailSender

  beforeEach(() => {
    emailSender = {
      send: jest.fn().mockResolvedValue({
        ok: true,
        message: 'Email was sent'
      })
    }
    sut = new SendEmailNotificationUseCase(emailSender)
  })

  it('should send an email notification', async () => {
    const payload = {
      timestamp: Date.now(),
      sourceEmail: 'source@test.com',
      targetEmail: 'target@test.com',
      subject: 'Test',
      body: '<p>This is a test e-mail</p>',
      tags: ['tag1', 'tag2']
    }

    const result = await sut.send(payload)

    expect(result.ok).toBe(true)
    expect(result.message).toBe('Email was sent')
  })

  it('should not send an email notification if source email is not allowed', async () => {
    const payload = {
      timestamp: Date.now(),
      sourceEmail: 'wrong-source@test.com',
      targetEmail: 'target@test.com',
      subject: 'Test',
      body: '<p>This is a test e-mail</p>',
      tags: ['tag1', 'tag2']
    }

    const result = await sut.send(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Email wrong-source@test.com is not allowed to send emails')
  })

  it('should not send an email notification if there are missing properties in EmailNotification entity', async () => {
    const payload = {
      timestamp: Date.now(),
      subject: 'Test',
      body: '<p>This is a test e-mail</p>',
      tags: ['tag1', 'tag2']
    } as any

    const result = await sut.send(payload)

    expect(result.ok).toBe(false)
    expect(result.message).toBe('sourceEmail is required, targetEmail is required')
  })
})
