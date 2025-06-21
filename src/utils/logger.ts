import chalk from "chalk"


export const logger = {
  debug: (message?: string) => {
    if(process.env.DEBUG === 'true'){
      console.log(chalk.yellow(message));
    }
  },
  info: (message?: string, color?: string) => {
    if (color) {
      console.log(chalk[color](message));
    } else {
      console.log(message)
    }
  },
  warning: (message?: string) => {
    console.warn(chalk.yellow(message));
  },
  error: (message?: string | Object) => {
    console.error(chalk.red(message))
  }
}

export function printChaptersDownloadProgress(current: number, total: number) {
  if(process.env.DEBUG !== 'true'){
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`[+] Downloaded ${current}/${total} chapters${current === total ? '\n' : ''}`);
  }else{
    logger.debug(`[DEBUG] Download ${current}/${total} of chapters${current === total ? '\n' : ''}`)
  }
}