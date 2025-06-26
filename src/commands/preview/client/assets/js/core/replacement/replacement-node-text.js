/**
 * Classe responsável por aplicar substituições de texto em nós de texto dentro de um elemento raiz.
 * Utiliza TreeWalker para percorrer o DOM e substituir ocorrências de texto com base em uma lista fornecida.
 */
export class ReplacementNodeText {
  /**
    * Executa substituições de texto em todos os nós de texto dentro do `rootElement`.
    * Substitui apenas os textos de elementos que ainda **não** foram marcados como `data-processed="true"`.
    *
    * @param {HTMLElement} rootElement - O elemento raiz onde será feita a varredura e substituição.
    * @param {Object.<string, string>} [replacementList={}] - Objeto com pares chave-valor onde:
    *        a chave é o texto original a ser substituído e o valor é o texto de substituição.
    *
    * @returns {void}
    */
  execute = (rootElement, replacementList = {}) => {
    const walker = document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while ((node = walker.nextNode())) {

      if (!node.parentElement?.dataset?.processed) {
        let newString = node.nodeValue;
        for (const [original, replacement] of Object.entries(replacementList)) {
          if (newString.includes(original)) {
            newString = newString.replaceAll(original, replacement)
            node.parentElement.dataset.processed = true
          }

          node.nodeValue = newString; 
        }
      }
    }
  }
}