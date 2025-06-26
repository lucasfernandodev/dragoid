export const htmlToElement = (htmlString) => {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim(); // remove espaços em branco extras
    return template.content.firstElementChild;
}