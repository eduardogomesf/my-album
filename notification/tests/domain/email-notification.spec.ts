import { EmailNotification } from '@/domain/entity'

describe('Email Notification entity', () => {
  it('should create an email notification', () => {
    const emailNotification = new EmailNotification({
      timestamp: Date.now(),
      sourceEmail: 'source@test.com',
      targetEmail: 'target@test.com',
      subject: 'Test Email',
      body: '<p>This is a test e-mail </p>',
      tags: ['tag1', 'tag2'],
      text: 'This is a test e-mail'
    })

    expect(emailNotification).toBeDefined()
    expect(emailNotification.timestamp).toBeGreaterThan(0)
    expect(emailNotification.sourceEmail).toBe('source@test.com')
    expect(emailNotification.targetEmail).toBe('target@test.com')
    expect(emailNotification.subject).toBe('Test Email')
    expect(emailNotification.body).toBe('<p>This is a test e-mail </p>')
    expect(emailNotification.tags).toEqual(['tag1', 'tag2'])
    expect(emailNotification.text).toBe('This is a test e-mail')
  })

  it('should throw an error if required fields are missing', () => {
    expect(() => {
      new EmailNotification({
        timestamp: undefined,
        sourceEmail: undefined,
        targetEmail: undefined,
        subject: undefined,
        body: undefined
      } as any)
    }).toThrow('timestamp is required, sourceEmail is required, targetEmail is required, subject is required, body is required')
  })
})
