import { createFetcher } from './../src/services/fetcher/factorio.ts';
import fs, { writeFile } from 'node:fs/promises';
import path from "path";
import { logger } from '../src/utils/logger.ts';
import { testPages } from './pages.ts';

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export const main = async () => {
  logger.info("Starting pretest..")
  const assetsDir = path.resolve('.', 'tests', 'assets', 'html');
  // Cria as pastas necessarias caso não exista
  await ensureDir(assetsDir)


  const fetcher = createFetcher('browser');

  for (const site of Object.keys(testPages)) {
    logger.info(`Downloading ${site} page`)
    const target = testPages[site as keyof typeof testPages]
    const { url, targetName } = target;
    const html = await fetcher.fetch(url);
    await writeFile(path.join(assetsDir, `${targetName}.html`), html, 'utf-8');
  }
  await fetcher.closeBrowser()
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});