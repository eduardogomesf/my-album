import { BaseEntity } from './base.entity'

interface EmailNotificationConstructor {
  timestamp: number
  sourceEmail: string
  targetEmail: string
  subject: string
  body: string
  tags?: string[]
  text?: string
}

export class EmailNotification extends BaseEntity {
  timestamp: number
  sourceEmail: string
  targetEmail: string
  subject: string
  body: string
  tags?: string[]
  text?: string

  constructor(
    emailNotification: EmailNotificationConstructor
  ) {
    super()
    this.timestamp = emailNotification.timestamp
    this.sourceEmail = emailNotification.sourceEmail
    this.targetEmail = emailNotification.targetEmail
    this.subject = emailNotification.subject
    this.body = emailNotification.body
    this.tags = emailNotification.tags

    const validation = this.validate()

    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }
  }

  validate(): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    if (!this.timestamp) {
      errors.push('timestamp is required')
    }
    if (!this.sourceEmail) {
      errors.push('sourceEmail is required')
    }
    if (!this.targetEmail) {
      errors.push('targetEmail is required')
    }
    if (!this.subject) {
      errors.push('subject is required')
    }
    if (!this.body) {
      errors.push('body is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
