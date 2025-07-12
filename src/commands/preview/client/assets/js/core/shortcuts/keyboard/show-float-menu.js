export const showFlotMenuShortcut = () => {
  const floatMenuElement = document.querySelector('.floating-navigation');
  if (!floatMenuElement) {
    console.error('Floating Menu not found!')
  }

  const toggleFloatMenuVisibility = () => {
    floatMenuElement.classList.toggle('show')
    setTimeout(() => {
      if(floatMenuElement.classList.contains('show')){
        floatMenuElement.classList.remove('show')
      }
    }, 2000)
  }

  let count = 0;
  let timer = null;
  document.addEventListener('click', () => {
    count++;

    if (count === 3) {
      toggleFloatMenuVisibility()
      count = 0;
      clearTimeout(timer)
    }

    if (count >= 3) {
      count = 0;
      clearTimeout(timer)
    }

    clearTimeout(timer)
    timer = setTimeout(() => {
      count = 0
    }, 300)
  })
}