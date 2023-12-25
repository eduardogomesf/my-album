import * as chalk from 'chalk'

export class Logger {
  private readonly logSource: string

  constructor(
    logSource: string
  ) {
    this.logSource = logSource

    this.validate()
  }

  private validate() {
    if (!this.logSource) {
      throw new Error('Log source is required')
    }
  }

  private formatMessage(message: string) {
    return `[${this.logSource}] ${message}`
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
