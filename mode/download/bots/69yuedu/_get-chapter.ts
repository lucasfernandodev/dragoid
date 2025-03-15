import { puppeteerInstance } from "../../../../lib/puppeteer.ts";

export const getChapterIn69yeudu = async (url: string) => {

  const puppeteer = await puppeteerInstance() 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'load',
  });

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


  await browser.close();


  return {
    title: result.title,
    content: result.content
  }
}