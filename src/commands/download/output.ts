import { join } from "path";
import { chapterScheme } from "../../core/schemas/chapter.ts";
import { ApplicationError } from "../../errors/application-error.ts";
import type { IChapterData, INovelData } from "../../types/bot.ts";
import type { OutputSupportedType } from "../../types/output-generate-files.ts";
import { writeFile } from "../../utils/file.ts";
import { resolveUserPath } from "../../utils/path.ts";
import { GenerateEpubService } from "../../services/generate-epub.ts";
import { GenerateTxtService } from "../../services/generate-txt.ts";
import { novelSchema } from "../../core/schemas/novel.ts";

export const generateOutputFile: OutputSupportedType = {
  novel: {
    json: async (filename: string, data: INovelData, path?: string) => {
      const jsonData = JSON.stringify(data, null, 2);
      const isValidData = novelSchema.safeParse(data);
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrieve novel data invalid', isValidData.error)
      }

      const outdir = path ? resolveUserPath(path) : process.cwd()
      const target = join(outdir, filename)
      await writeFile(target, 'json', jsonData);
    },
    txt: async (filename: string, data: INovelData, path?: string) => {
      const service = new GenerateTxtService();
      await service.execute({
        data,
        type: 'novel',
        filename,
        outputFolder: path || null
      })
    },
    epub: async (filename: string, data: INovelData, path?: string) => {
      const service = new GenerateEpubService()
      await service.execute({
        novel: data,
        filename,
        title: data.title,
        outputFolder: path || null
      })
    }
  },
  chapter: {
    json: async (filename: string, data: IChapterData, path?: string) => {
      const jsonData = JSON.stringify(data, null, 2);
      const isValidData = chapterScheme.safeParse(data);
      if (!isValidData.success) {
        throw new ApplicationError('Generate file error, retrieve chapter data invalid', isValidData.error)
      }

      const outdir = path ? resolveUserPath(path) : process.cwd()
      const target = join(outdir, filename)
      await writeFile(target, 'json', jsonData);
    },
    txt: async (filename: string, data: IChapterData, path?: string) => {
      const service = new GenerateTxtService();
      await service.execute({
        data,
        type: 'chapter',
        filename,
        outputFolder: path || null
      })
    }
  }
}