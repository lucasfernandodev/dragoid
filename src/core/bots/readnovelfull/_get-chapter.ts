import axios from 'axios';
import {type CheerioAPI, load} from 'cheerio';
import { BotError } from '../../../errors/bot-error.ts';

export const readnovelfullGetChapter = async (url: string) => {

  const getTitle = ($: CheerioAPI) => {
    return $('.chr-title span').first().text();
  }

  const getContent = ($: CheerioAPI) => {
    return $('#chr-content p').map((_, el) => $(el).text()).get();
  }
  
  
  const response = await axios.get(url);
  if(!('data' in response)){
    throw new BotError('Retrive chapter page failed', response)
  }
  
  const $ = load(response.data)

  return {
    title: getTitle($),
    content: getContent($)
  }
}