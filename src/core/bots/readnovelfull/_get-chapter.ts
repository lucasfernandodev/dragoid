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

  const chapter = {
    title: getTitle($),
    content: getContent($)
  }

  if(!chapter.title.trim() && chapter.content.length === 0){
    throw new BotError('No information could be retrieved.\n- Check if the url is correct\n- Check if the website is working')
  }

  return chapter
}