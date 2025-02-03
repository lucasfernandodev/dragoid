export const CLIListOutputFormats = (mode: 'novel' | 'chapter') => {
  if (mode === 'novel') {
    console.log('Supported output formats for the Novel mode:')
    console.log('[🗸] EPUB \n[🗸] HTML \n[🗸] JSON')
  } else if (mode === 'chapter') {
    console.log('Supported output formats for the Chapter mode:')
    console.log('[🗸] HTML \n[🗸] JSON')
  }
}