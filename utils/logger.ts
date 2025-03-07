import chalk from "chalk"

export const logger = {
  info: (message: string, level = 1, exit = false, exitCode = 0) => {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 1
    if (level === DEBUG_LEVEL) {
      console.log(message);
      if(exit) process.exit(exitCode)
    }
  },
  error: (message: string, level = 1,  exit = false, exitCode = 0) => {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 1
    if (level === DEBUG_LEVEL) {
      console.error(chalk.red(message))
      if(exit) process.exit(exitCode)
    }
  },
  warning: (message: string, level = 1,  exit = false, exitCode = 0) => {
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL || 1
    if (level === DEBUG_LEVEL) {
      console.error(chalk.yellow(message))
      if(exit) process.exit(exitCode)
    }
  }
}