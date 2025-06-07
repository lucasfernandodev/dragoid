import { BotError } from "../../../errors/bot-error.ts";
import { puppeteerInstance } from "../../../lib/puppeteer.ts";
import type { DownloadNovelOptions, INovelData, IChapterData } from "../../../types/bot.ts";
import { downloadImage, processImageToBase64 } from "../../../utils/images.ts";
import { logger } from "../../../utils/logger.ts";
import { processChaptersList } from "../../process-chapter-list.ts";



function collectPageData() {
  const description: string[] = []
  const title = document.querySelector(".booknav2 h1 a")?.textContent || null;
  const author = document.querySelectorAll(".booknav2 p a")[0]?.textContent || null;
  const descriptionText = document.querySelectorAll(".mybox .navtxt p");



  descriptionText?.forEach(paragrafo => {
    let linhaAtual = '';

    paragrafo.childNodes.forEach((node: any) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        // Quando encontra um <br>, adiciona a linha atual ao array
        if (linhaAtual.trim()) {
          description.push(linhaAtual.trim());
        }
        linhaAtual = ''; // Reinicia a linha
      } else {
        // Adiciona o conteúdo de nós de texto ou outros elementos
        linhaAtual += node.textContent;
      }
    });

    // Adiciona a última linha se houver conteúdo restante
    if (linhaAtual.trim()) {
      description.push(linhaAtual.trim());
    }
  })

  const genres = Array.from(document.querySelectorAll(".booknav2 h1 p")).map(content => {
    return content?.textContent?.includes('分类：') ? content?.textContent.split('分类：')[1] : undefined
  }).filter(content => content !== undefined) as string[]

  const imageURL = document.querySelector(".bookimg2 img")?.getAttribute('src');


  const chaptersListUrl = document.querySelectorAll(".addbtn .btn")[0]?.getAttribute('href');

  if (!title && !author && genres.length === 0 && !imageURL && !chaptersListUrl) {
    return null;
  }

  return {
    title,
    author,
    genres,
    imageURL: chaptersListUrl ? imageURL : null,
    chaptersListUrl: chaptersListUrl ? chaptersListUrl : null,
    description
  }

}

function collectChapterList() {
  let chaptersList: { title: string, url: string }[] = []
  const links = Array.from(document.querySelectorAll('#catalog ul li a'));
  links.map(link => {
    chaptersList.push({
      url: link.getAttribute('href') as string,
      title: link.getAttribute('title') as string
    })
  })
  return chaptersList;
}

function collectChapter() {
  const title = document.querySelector('h1');
  const content = [] as string[];
  const container = document.querySelector(".txtnav");

  if (container) {
    container.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node?.textContent?.trim();
        if (text) content.push(text);
      }
    })
  }
  return {
    title: title?.textContent || '',
    content: content
  }
}

export const getNovel69yuedu = async (
  url: string,
  opt: DownloadNovelOptions
): Promise<INovelData> => {

  const puppeteer = await puppeteerInstance()

  // instancia o browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navega até a pagina alvo
  await page.goto(url, {
    waitUntil: 'load',
  });

  // Fica aguardando até que um titulo aparece na pagina
  await page.waitForSelector('h1');

  const result = await page.evaluate(collectPageData)

  if (!result) {
    throw new BotError(
      'Unable to retrieve any information from the target page. Check if the URL used is correct'
    )
  }

  // Check if list chapters url is collected
  if (!result.chaptersListUrl) {
    throw new BotError('List chapter not found')
  }


  // Navegá até a pagina de capítulos
  await page.goto(result.chaptersListUrl as string, { waitUntil: 'load' });


  // Aguarda até que a div com os capítulos seha carregada
  await page.waitForSelector('#catalog');



  // Colleta todos os urls dos capítulos da novel
  const chaptersList = await page.evaluate(collectChapterList);


  const chapters: IChapterData[] = []



  // Coleta os capítulos
  await processChaptersList(chaptersList, async ({ url }) => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('h1');

    const result = await page.evaluate(collectChapter);

    chapters.push({
      title: result.title,
      content: result.content
    })


    await context.close();
  }, {
    ...opt,
    chapterDownloadDelay: 2000
  })



  // Fecha o navegador;
  await browser.close();

  const getImage = async (url: string) => {
    if (!url) return '<image-url>'

    const bufferImage = await downloadImage(url);
    if (!bufferImage) {
      logger.warning('Novel thumbnail failed');
      return '<image-url>'
    }

    const base64Image = await processImageToBase64(bufferImage);
    if (!base64Image) return '<image-url>'

    return base64Image
  }

  return {
    title: result.title || 'Title unknown',
    author: result.author?.includes(",") ? result.author.split(',') : [result.author || 'Author unknown'],
    status: 'unknown',
    thumbnail: result.imageURL ? await getImage(result.imageURL) : '<image-url>',
    chapters: chapters,
    description: result.description,
    genres: [...result.genres || 'Author unknown'],
    language: 'chinese'
  }
}