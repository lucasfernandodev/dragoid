import chalk from "chalk"


export const logger = {
  info: (message: string) => {
    console.log(message);
  },
  warning: (message: string) => {
    console.warn(chalk.yellow(message));
  },
  error: (message: string) => {
    console.error(chalk.red(message))
  }
}

export function printChaptersDownloadProgress(current: number, total: number) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`[+] Downloaded ${current}/${total} chapters${current === total ? '\n' : ''}`);
}