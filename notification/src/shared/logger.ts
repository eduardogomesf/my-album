import * as chalk from 'chalk'

export class Logger {
  static verbose(message: string) {
    console.debug(chalk.cyan(message))
  }

  static warn(message: string) {
    console.warn(chalk.yellow(message))
  }

  static info(message: string) {
    console.info(chalk.green(message))
  }

  static error(message: any) {
    console.error(chalk.red(message))
  }

  static fatal(message: any) {
    console.error(chalk.bgRed(message))
  }
}
