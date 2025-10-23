import fs from 'node:fs'
import Epub from 'epub-gen'
import type { INovelData } from '../types/bot.ts'
import { join } from 'node:path'
import { base64ToFileUrl } from '../utils/file.ts'
import { ApplicationError } from '../errors/application-error.ts'
import { logger } from '../utils/logger.ts'
import { resolveUserPath } from '../utils/io.ts'

interface Props {
  title: string
  filename: string
  outputFolder: string | null
  novel: INovelData
}

interface EpubOptions {
  title: string
  author: string
  publisher: string
  cover: string
  css?: string
  lang?: string
  tocTitle?: string
  content: {
    title: string
    data: string
    author?: string
    beforeToc?: boolean
    excludeFromToc?: boolean
  }[]
}

/**
 * Class responsible for generating EPUB files from structured novel data.
 * Internally uses the `epub-gen` library and handles errors and logs silently.
 */
export class GenerateEpubService {
  private options = {} as EpubOptions

  constructor() {}

  /**
   * Silently executes the EPUB creation, suppressing console logs
   * and capturing errors from the `epub-gen` library.
   *
   * @param options - Configuration options for the EPUB.
   * @param target - Output path for the generated EPUB file.
   * @returns Promise that resolves when EPUB generation is complete.
   */
  private silenceExecutable = async (options: EpubOptions, target: string) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let epub: any = null
      const preserveNormalLog = console.log
      const preserveErrorLog = console.error

      console.log = () => {}
      console.error = () => {}

      const restoreLogs = () => {
        console.log = preserveNormalLog
        console.error = preserveErrorLog
      }

      // Generate epub
      try {
        epub = new Epub(options, target)
      } catch (err) {
        restoreLogs()
        return reject(err)
      }

      // EPub always sets up this.defer internally, even on early return
      // so we grab epub.defer.promise directly
      epub.defer.promise.then(resolve).catch(reject).finally(restoreLogs)
    })
  }

  /**
   * Creates the template for the EPUB introduction page (title page).
   * Includes authors, genres, and the book description.
   *
   * @param description - List of paragraphs describing the book.
   * @param authors - List of the book's authors.
   * @param genres - List of the book's genres.
   * @returns Object with metadata and formatted HTML for the introduction page.
   */
  private creatingIntroPageTemplate = (
    description: string[],
    authors: string[],
    genres: string[]
  ) => {
    const _description = description.map((t) => `<p>${t}</p>`).join('\n')
    const _author = authors.join(', ')
    const _genres = genres.join(', ')

    const template = `
      <div class="row">
        <h3>Author: </h3>
        <span>${_author}</span>
      </div>
      <div class="row">
        <h3>Genres: </h3>
        <span>${_genres}</span>
      </div>
      <div>
        <h3>Description: </h3>
        ${_description}
      </div>
    `

    return {
      title: 'Introduction',
      beforeToc: true,
      data: template,
    }
  }

  /**
   * Creates the HTML template for an individual chapter of the book.
   *
   * @param title - Chapter title.
   * @param content - List of paragraphs that make up the chapter content.
   * @returns Object containing the chapter title and HTML content.
   */
  private creatingChapterPageTemplate = (title: string, content: string[]) => {
    const contentHTML = content.map((t) => `<p>${t}</p>`).join('\n')
    const template = `<div>${contentHTML}</div>`
    return {
      title,
      data: template,
    }
  }

  /**
   * Removes the temporary cover image file, if it exists.
   *
   * @param path - Absolute path of the file to be deleted.
   */
  private deleteTmpCover = (path: string) => {
    fs.unlink(path, (err) => {
      if (err) {
        logger.error('Remove cover image file from tmp folder failed', err)
        return
      }
    })
  }

  /**
   * Main method to execute the EPUB generation.
   *
   * @param props - Object containing the novel data and output settings.
   * @param props.title - Title of the EPUB.
   * @param props.novel - Object with the structured data of the novel.
   * @param props.filename - Name of the output file (without extension).
   * @param props.outputFolder - Output folder for the EPUB (optional).
   * @throws {ApplicationError} If EPUB generation fails for any reason.
   */
  public execute = async ({ title, novel, filename, outputFolder }: Props) => {
    // Transform thumbnail base64 to file and write in disk to get path
    const getThumbnailFile = async (data?: string): Promise<string> => {
      if (!data || data === '' || data === '<image-url>') return ''
      const filePath = await base64ToFileUrl(data)
      return filePath
    }

    const introPage = this.creatingIntroPageTemplate(
      novel.description,
      novel.author,
      novel.genres
    )

    const chaptersPage = novel.chapters.map((chapter) => {
      return this.creatingChapterPageTemplate(chapter.title, chapter.content)
    })

    this.options = {
      title,
      author: novel.author.join(', '),
      publisher: 'unknown',
      css: `
        .row h3{
          display: inline-block;
          width: fit-content;
        }
        .row span{
          display: inline-block;
          margin-left: 6px;
        }
      `,
      cover: await getThumbnailFile(novel.thumbnail),
      content: [introPage, ...chaptersPage],
    }

    const outdir = outputFolder ? resolveUserPath(outputFolder) : process.cwd()
    const target = join(outdir, `${filename}.epub`)

    try {
      await this.silenceExecutable(this.options, target)
    } catch (error) {
      throw new ApplicationError(
        `Generation of EPUB file failed. ${(error as Error).message}`,
        error
      )
    } finally {
      this.deleteTmpCover(this.options.cover)
    }
  }
}
