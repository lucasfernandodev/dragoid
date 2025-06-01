export const onTouchGesture = (callback = () => { }) => {
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