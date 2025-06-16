import { join } from "path";
import type { IChapterData, INovelData } from "../types/bot.ts";
import { resolveUserPath } from "../utils/path.ts";
import { writeFile } from "../utils/file.ts";
import { ApplicationError } from "../errors/application-error.ts";

interface RequiredProps {
  filename: string;
  type: 'novel' | 'chapter'
  outputFolder: string | null;
}

interface WithNovel extends RequiredProps {
  type: 'novel';
  data: INovelData
}

interface WithChapter extends RequiredProps {
  type: 'chapter';
  data: IChapterData
}

type Props = WithNovel | WithChapter;

type GenerateContentType = Omit<Props, 'filename' | 'outputFolder'>


export class GenerateTxtService {

  private createNovelIntroTemplate = (
    title: string,
    author: string[],
    genres: string[],
    descriptions: string[],
  ) => {

    const template = `[==============================================================]-\n${title}\n\nAuthor: ${author.join(", ")}\n\ngenres: ${genres.join(", ")}\n\ndescription:\n${descriptions.join('\n')}\n[==============================================================]\n\n`
    return template;
  }




  private createChapterTemplate = (title: string, content: string[]) => {
    const template = `\n[==============================================================]\n${title}\n[==============================================================]\n\n${content.join('\n\n')}\n`
    return template
  }



  private saveFile = async (content: string, filename: string, outputFolder: string | null) => {
    const outdir = outputFolder ? resolveUserPath(outputFolder) : process.cwd()
    const target = join(outdir, `${filename}`);
    await writeFile(target, 'txt', content)
  }

  public generateContent = ({ data, type }: GenerateContentType) => {
    if (type === 'novel') {
      const novel = data as INovelData
      const introPageTemplate = this.createNovelIntroTemplate(
        novel.title,
        novel.author,
        novel.genres,
        novel.description
      )
      const chapters = novel.chapters.map(chapter => {
        return this.createChapterTemplate(chapter.title, chapter.content)
      })

      return `${introPageTemplate}${chapters.join("\n")}`
    }

    if (type === 'chapter') {
      const chapter = data as IChapterData
      return this.createChapterTemplate(
        chapter.title,
        chapter.content
      );
    }

    throw new ApplicationError(`Generate txt file error. ${type} is invalid`)
  }


  public execute = async (props: Props) => {
    const { filename, type, outputFolder, data, } = props
    const content = this.generateContent({ type, data })
    await this.saveFile(
      content,
      filename,
      outputFolder
    )
  }
}