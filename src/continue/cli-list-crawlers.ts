export const CLIListCrawlers = (crawlersName: string[]) => {
  if(crawlersName.length === 0){
    console.log('No crawlers found')
    process.exit(0)
  }

  const list = crawlersName.map(name => `[🗸] ${name}\n`)
  console.log('Available crawlers:')
  console.log(list.join(''))
  process.exit()
}