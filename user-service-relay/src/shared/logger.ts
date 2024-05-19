import * as chalk from 'chalk'
import { DateTime } from 'luxon'

export class Logger {
  private readonly logSource: string
  private readonly timezone: string

  constructor(
    logSource: string
  ) {
    this.logSource = logSource
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    this.validate()
  }

  private validate() {
    if (!this.logSource) {
      throw new Error('Log source is required')
    }

    if (!this.timezone) {
      throw new Error('Timezone is required')
    }
  }

  private formatMessage(message: string, correlationId?: string) {
    const now = DateTime.now().setZone(this.timezone).toFormat('yyyy-MM-dd HH:mm:ss')
    const correlation = correlationId ? `[correlation-id:${correlationId}]` : ''
    return `[${now}][${this.logSource}]${correlation} ${message}`
  }

  verbose(message: string, correlationId?: string) {
    console.debug(
      chalk.cyan(
        this.formatMessage(message, correlationId)
      )
    )
  }

  warn(message: string, correlationId?: string) {
    console.warn(
      chalk.yellow(
        this.formatMessage(message, correlationId)
      )
    )
  }

  info(message: string, correlationId?: string) {
    console.info(
      chalk.green(
        this.formatMessage(message, correlationId)
      )
    )
  }

  error(message: any, correlationId?: string) {
    console.error(
      chalk.red(
        this.formatMessage(message, correlationId)
      )
    )
  }

  fatal(message: any, correlationId?: string) {
    console.error(
      chalk.bgRed(
        this.formatMessage(message, correlationId)
      )
    )
  }
}
