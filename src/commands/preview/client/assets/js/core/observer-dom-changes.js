/**
 * Observa mudanças no DOM dentro de um nó raiz fornecido e executa um callback sempre que elementos filhos forem adicionados ou removidos.
 * 
 * A observação é feita com `MutationObserver`, reiniciando a observação após cada detecção para garantir a continuidade.
 * Um pequeno `debounce` (50ms) é aplicado para evitar múltiplas execuções do callback em mudanças rápidas consecutivas.
 *
 * @param {HTMLElement} rootNode - O elemento DOM raiz que será observado.
 * @param {Function} [callback=() => {}] - A função que será executada sempre que mudanças forem detectadas.
 *
 * @returns {void}
 */
export const observerDomChanges = (rootNode, callback = () => { }) => {
  let timer = null;

  // Configura os tipos de mutações que você quer observar
  const config = {
    childList: true,      // observar a adição/remoção de elementos filhos
    subtree: true,        // observar a árvore completa abaixo de targetNode
  };

  // Callback a ser executado quando uma mutação for detectada
  const observerCallback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        clearTimeout(timer);
        timer = setTimeout(() => {
          observer.disconnect();
          callback()
          observer.observe(rootNode, config)
        }, 50)
      }
    }
  };

  // Cria o observador e passa a função de callback
  const observer = new MutationObserver(observerCallback);

  // Inicia a observação
  observer.observe(rootNode, config);
}