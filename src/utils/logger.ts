import chalk from "chalk"

export const logger = {
  /**
   * Logs an informational message to the console in blue color.
   *
   * @param {string} message - The main message to log.
   * @param {...any} optionalParams - Additional parameters to append to the log.
   * @returns {void}
   */
  info: (message: string, ...optionalParams: any[]): void => {
    console.info(chalk.white(message, ...optionalParams));
  },

  /**
   * Logs a warning message to the console in yellow color.
   *
   * @param {string} message - The warning message to log.
   * @param {...any} optionalParams - Additional parameters to append to the warning.
   * @returns {void}
   */
  warning: (message: string, ...optionalParams: any[]): void => {
    console.warn(chalk.yellow(message, ...optionalParams));
  },

  /**
    * Logs an error message to the console in red color.
    *
    * @param {string} message - The error message to log.
    * @param {...any} optionalParams - Additional parameters to append to the error output.
    * @returns {void}
    */
  error: (message: string, ...optionalParams: any[]): void => {
    console.error(chalk.red(message, ...optionalParams));
  },

  /**
   * Logs a debug message to the console in gray color if debugging is enabled.
   *
   * @param {string} message - The debug message to log.
   * @param {...any} optionalParams - Additional parameters to append to the debug output.
   * @returns {void}
   */
  debug: (message: string, ...optionalParams: any[]): void => {
    if (process.env.DEBUG === 'true') {
      console.log(chalk.gray(message, ...optionalParams));
    }
  },

  /**
   * Writes a progress message to the current console line, optionally ending with a newline.
   *
   * Clears the current line and moves the cursor back to the start before writing.
   *
   * @param {string} message - The progress message to display.
   * @param {boolean} [isEnd=true] - If true, appends a newline after the message; otherwise leaves the cursor at end of message.
   * @returns {void}
   */
  infoProgress: (message: string, isEnd: boolean = true): void => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.white(`${message}${isEnd ? '\n' : ''}`))
  }
}



export function printChaptersDownloadProgress(current: number, total: number) {
  if (process.env.DEBUG !== 'true') {
    logger.infoProgress(`[+] Downloaded ${current}/${total} chapters`, current === total);
  } else { 
    logger.debug(`[DEBUG] Download ${current}/${total} of chapters`)
  }
}