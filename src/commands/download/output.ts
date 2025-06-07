import { chapterScheme } from "../../core/schemas/chapter.ts";
import { novelFileSchema } from "../../core/schemas/novel.ts";
import { ApplicationError } from "../../errors/application-error.ts";
import type { IChapterData, INovelData } from "../../types/bot.ts";
import type { OutputSupportedType } from "../../types/output-generate-files.ts";
import { writeFile } from "../../utils/file.ts";

export const generateOutputFile: OutputSupportedType = {
  novel: {
    json: async (filename: string, data: INovelData) => {
      const jsonData = JSON.stringify(data, null, 2);
      const isValidData = novelFileSchema.safeParse(data);
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrive novel data invalid', isValidData.error)
      }
      await writeFile(filename, 'json', jsonData);
    }
  },
  chapter: {
    json: async (filename: string, data: IChapterData) => {
      const jsonData = JSON.stringify(data, null, 2);
      const isValidData = chapterScheme.safeParse(data);
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrive chapter data invalid', isValidData.error)
      }
      await writeFile(filename, 'json', jsonData);
    }
  }
}