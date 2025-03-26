export const isMobile = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const isMobile = computedStyle.getPropertyValue('--is-mobile').trim();
  const value = Number.parseInt(isMobile || '0');
  return value === 1 ? true : false;
}

export const onGesture = (callback = () => { }) => {
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