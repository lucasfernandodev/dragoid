import { writeFile } from '../utils.ts'
import type { NovelOutput } from './cli.ts'

type SharedPropsType = {
  filename: string
}

type GenerateNovel = {
  mode: 'novel',
  type?: 'json' | 'epub' | 'html',
  data: NovelOutput
}

type GenerateChapter = {
  mode: 'chapter',
  type?: 'json' | 'html',
  data: NovelOutput['chapters'][0]
}

type Props = (GenerateNovel | GenerateChapter) & SharedPropsType

export const CLIGenerateOuputFile = async ({mode,data, filename, type = 'json'}: Props) => {

  if(filename.length === 0){
    console.log('Filename is required')
    process.exit(1)
  }

  const generate = {
    novel: {
      html: async (data: GenerateNovel['data']) => {},
      json: async (data: GenerateNovel['data']) => {
        const jsonData = JSON.stringify(data, null, 2);
        await writeFile(filename, 'json', jsonData)
      },
      epub: async (data: GenerateNovel['data']) => {},
    },
    chapter: {
      html: async (data: GenerateChapter['data']) => {},
      json: async (data: GenerateChapter['data']) => {
        const jsonData = JSON.stringify(data, null, 2);
        await writeFile(filename, 'json', jsonData)
      },
    }
  }

  if(mode ==='novel'){
    await generate.novel[type](data)
  }

  if(mode ==='chapter'){
    await generate.chapter[type](data)
  }
}