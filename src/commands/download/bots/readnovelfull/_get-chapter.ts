import axios from 'axios';
import {type CheerioAPI, load} from 'cheerio';
import { exitOnFetchError } from '../../../../utils/exitOnFetchError.ts';

export const readnovelfullGetChapter = async (url: string) => {

  const getTitle = ($: CheerioAPI) => {
    return $('.chr-title span').first().text();
  }

  const getContent = ($: CheerioAPI) => {
    return $('#chr-content p').map((_, el) => $(el).text()).get();
  }
  
  
  const response = await exitOnFetchError(async () => axios.get(url));
  const data  = response?.data;
  const $ = load(data)

  return {
    title: getTitle($),
    content: getContent($)
  }
}