export const isMobile = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const isMobile = computedStyle.getPropertyValue('--is-mobile').trim();
  const value = Number.parseInt(isMobile || '0');
  return value === 1 ? true : false;
}

const onGesture = (callback = () => { }) => {
  let touchCount = 0; // Contador de toques
  const touchDelay = 500; // Tempo máximo entre toques (em milissegundos)

  function resetTouchCount() {
    touchCount = 0;
  }

  document.addEventListener('touchstart', () => { 
    touchCount++;

    // Verifica se é o terceiro toque
    if (touchCount === 3) {
      console.log('Triplo toque detectado!');
      callback();

      // Reseta o contador imediatamente
      resetTouchCount();
      return;
    }

    // Reseta o contador após o tempo limite
    setTimeout(() => {
      resetTouchCount();
    }, touchDelay);
  });
}



const main = () => {
  const _isMobile = isMobile();
  const navigationMenu = document.querySelector(".navigation-chapters");
  if (!_isMobile) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop; // Posição atual de rolagem
    const scrollHeight = document.documentElement.scrollHeight; // Altura total do conteúdo
    const clientHeight = window.innerHeight || document.documentElement.clientHeight; // Altura visível
    const endgap = 160;

    if (scrollTop + clientHeight >= scrollHeight - endgap) {
       
    } 
  });



  let isMenuOpen = false;



  // Função a ser chamada no triplo toque
  function toggleNavigation() {
    navigationMenu.style.display = 'flex'
    isMenuOpen = true
    setTimeout(() => {  
      navigationMenu.style.display = "none";
      isMenuOpen = false;
    }, 1500)
  }

  onGesture(toggleNavigation)
}

main()