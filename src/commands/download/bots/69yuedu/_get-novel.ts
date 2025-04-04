import type { DownloadNovelOptions, IChapterData, INovelData } from '../../../../types/bot.ts';
import { logger, printChaptersDownloadProgress } from '../../../../utils/logger.ts';
import { puppeteerInstance } from '../../../../lib/puppeteer.ts';
import { downloadImage, processImageToBase64 } from '../../../../utils/images.ts';
import { BotError } from '../../../../errors/bot-error.ts';
import { delay } from '../../../../utils/delay.ts';
import { processChaptersList } from '../../../../core.ts'; 

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

  const result = await page.evaluate(() => {
    const description: string[] = []
    const title = document.querySelector(".booknav2 h1 a")?.textContent;
    const author = document.querySelectorAll(".booknav2 p a")[0].textContent;
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

    return {
      title,
      author,
      genres,
      imageURL: chaptersListUrl ? `https://${window.location.hostname + imageURL}` : null,
      chaptersListUrl: chaptersListUrl ? `https://${window.location.hostname + chaptersListUrl}` : null,
      description
    }
  })

  // Check if list chapters url is collected
  if (!result.chaptersListUrl) {
    throw new BotError('List chapter not found')
  }

  // Navegá até a pagina de capítulos
  await page.goto(result.chaptersListUrl as string, { waitUntil: 'load' });


  // Aguarda até que a div com os capítulos seha carregada
  await page.waitForSelector('#chapters');

  // Colleta todos os urls dos capítulos da novel
  const chaptersList = await page.evaluate(() => {
    let chaptersList: { title: string, url: string }[] = []
    const links = Array.from(document.querySelectorAll('#chapters ul li a'));
    links.map(link => {
      chaptersList.push({
        url: `https://${window.location.hostname + link.getAttribute('href')}` as string,
        title: link.getAttribute('title') as string
      })
    })
    return chaptersList;
  });


  const chapters: IChapterData[] = []

  // Coleta os capítulos
  await processChaptersList(chaptersList, async ({url}) => {
    await page.goto(url, { waitUntil: 'load', timeout: 600000 });
    await page.waitForSelector('h1');

    const result = await page.evaluate(() => {
      const results: string[] = []

      const title = (document.querySelector('.txtbox h1') as any)?.innerText;

      const getRow = (ph: any) => {
        let row = '';
        const nodes = ph.childNodes;
        nodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            if(row.trim()){
              results.push(row.trim())
            }
            row = ''
          }else{
            row+=node.textContent
          }
        });

        if(row.trim()){
          results.push(row.trim());
        }
      }

      document.querySelectorAll('.content .cp').forEach(getRow);

      return {
        title,
        content: results
      }
    });

    chapters.push({
      title: result.title,
      content: result.content
    }) 

    await delay(500)
  }, opt)
  
 

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