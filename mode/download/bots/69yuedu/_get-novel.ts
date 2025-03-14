import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { downloadAndProcessImage } from '../../../../utils/get-image.ts';
import type { IChapterData, INovelData } from '../../../../types/bot.ts';
import { logger } from '../../../../utils/logger.ts';

puppeteer.use(StealthPlugin())

export const getNovel69yuedu = async (url: string): Promise<INovelData> => {

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


    const chaptersListURl = document.querySelectorAll(".addbtn .btn")[0]?.getAttribute('href');

    return {
      title,
      author,
      genres,
      imageURL: chaptersListURl ? `https://${window.location.hostname + imageURL}` : null,
      chaptersListURl: chaptersListURl ? `https://${window.location.hostname + chaptersListURl}` : null,
      description
    }
  })

  // Check if list chapters url is collected
  if (!result.chaptersListURl) {
    logger.error("[x] Error: List chapter not found", 1, true)
  }

  // Navegá até a pagina de capítulos
  await page.goto(result.chaptersListURl as string, { waitUntil: 'load' });


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

  // Colleta os capítulos
  for (const { url } of chaptersList) {
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForSelector('h1');

    const result = await page.evaluate(() => {
      const results: string[] = []
      const title = (document.querySelector('.txtbox h1') as any)?.innerText;

      document.querySelectorAll('.content .cp').forEach(paragrafo => {
        let linhaAtual = '';

        paragrafo.childNodes.forEach((node: any) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            // Quando encontra um <br>, adiciona a linha atual ao array
            if (linhaAtual.trim()) {
              results.push(linhaAtual.trim());
            }
            linhaAtual = ''; // Reinicia a linha
          } else {
            // Adiciona o conteúdo de nós de texto ou outros elementos
            linhaAtual += node.textContent;
          }
        });

        // Adiciona a última linha se houver conteúdo restante
        if (linhaAtual.trim()) {
          results.push(linhaAtual.trim());
        }
      });

      return {
        title,
        content: results
      }
    });

    chapters.push({
      title: result.title,
      content: result.content
    })

  }

  // Fecha o navegador;
  await browser.close();


  return {
    title: result.title || 'Title unknown',
    author: result.author?.includes(",") ? result.author.split(',') : [result.author || 'Author unknown'],
    status: 'unknown',
    thumbnail: result.imageURL ? await downloadAndProcessImage(result.imageURL) : '',
    chapters: chapters,
    description: result.description,
    genres: [...result.genres || 'Author unknown'],
    language: 'chinese'
  }
}