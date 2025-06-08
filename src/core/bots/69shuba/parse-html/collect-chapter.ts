export const collectChapter69shuba = () => {

  window.localStorage.clear();

  const content: string[] = [];
  const titleHTML = document.querySelector('h1');
  const containerHTML = document.querySelector(".txtnav")

  if(!containerHTML || !titleHTML) return null;

  const nodes = Array.from(containerHTML.childNodes).filter(el => el !== titleHTML);
  const title = titleHTML?.textContent?.trim();

  if(!title) return null;

  for(const node of nodes){
    const isTextNode = node.nodeType === Node.TEXT_NODE;
    if(isTextNode){
      const text = node?.textContent?.trim();
      text && content.push(text);
    }
  }


  return {
    title,
    content
  }
}