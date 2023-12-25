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

  private formatMessage(message: string) {
    const now = DateTime.now().setZone(this.timezone).toFormat('yyyy-MM-dd HH:mm:ss')
    return `[${now}][${this.logSource}] ${message}`
  }

  verbose(message: string) {
    console.debug(
      chalk.cyan(
        this.formatMessage(message)
      )
    )
  }

  warn(message: string) {
    console.warn(
      chalk.yellow(
        this.formatMessage(message)
      )
    )
  }

  info(message: string) {
    console.info(
      chalk.green(
        this.formatMessage(message)
      )
    )
  }

  error(message: any) {
    console.error(
      chalk.red(
        this.formatMessage(message)
      )
    )
  }

  fatal(message: any) {
    console.error(
      chalk.bgRed(
        this.formatMessage(message)
      )
    )
  }
}
