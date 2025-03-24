import { novelWithDownloadInfo } from './schemas/novel.ts';
import type { IChapterData, INovelData } from "../../types/bot.ts";
import { writeFile } from "../../utils/file.ts";
import { chapterScheme } from './schemas/chapter.ts';
import { logger } from '../../utils/logger.ts';
import { ApplicationError } from '../../errors/application-error.ts';



interface INovelDataOuput {
  mode: 'novel',
  format: string,
  filename: string;
  novel: INovelData
}

interface IChapterDataOuput {
  mode: 'chapter',
  format: string,
  filename: string;
  chapter: IChapterData
}

type ExecuteData = INovelDataOuput | IChapterDataOuput;
export type OutputSupportedFormats = INovelDataOuput['format'] | IChapterDataOuput['format']

export class GenerateOutputFile {
  public getSupportedFormats = () => {
    return {
      novel: [
        'json'
      ],
      chapter: [
        'json'
      ]
    }
  }


  private toJSON = (data: INovelData | IChapterData) => {
    return JSON.stringify(data, null, 2);
  };


  private toHTML = () => { };


  public execute = async (data: ExecuteData) => {

    // Validate Returned Novel
    if (data.mode === 'novel') {
      const isValidData = novelWithDownloadInfo.safeParse(data)
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrive novel data invalid', isValidData.error) 
      }
    }

    // Validate Returned Chapter
    if (data.mode === 'chapter') {
      const isValidData = chapterScheme.safeParse(data.chapter);
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrive chapter data invalid', isValidData.error) 
      }
    }



    if (data.mode === 'novel' && data.format === 'json') {
      const json = this.toJSON(data.novel);
      await writeFile(data.filename, 'json', json);
    }

    if (data.mode === 'novel' && data.format === 'html') {
      logger.info('NOT IMPLEMENTED',)
    }

    if (data.mode === 'chapter' && data.format === 'json') {
      const json = this.toJSON(data.chapter);
      await writeFile(data.filename, 'json', json);
    }

    if (data.mode === 'chapter' && data.format === 'html') {
      logger.info('NOT IMPLEMENTED',)
    }

  }
}

