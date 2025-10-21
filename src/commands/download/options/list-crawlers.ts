import type { Bot } from '../../../types/bot.ts'
import { logger } from '../../../utils/logger.ts'

export const listCrawlersService = (bots: Bot[]) => {
  const content = bots.map((bot) => {
    const name = bot.options.name
    const tool = bot.options.help.scraping_tool
    const site = bot.options.help.site

    return `Bot ${name} \n` + `Tool: ${tool} \n` + `Site: ${site} \n\n`
  })

  logger.info('List Bots \n')
  logger.info(content.join(''))
  process.exit(0)
}
