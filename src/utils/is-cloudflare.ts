import { load } from 'cheerio'

export const isCloudflare = (page: string): boolean => {
  const $ = load(page)

  let score = 0

  // Título
  const title = $('title').text().trim().toLowerCase()

  if (title.includes('just a moment')) score += 4
  if (title.includes('attention required')) score += 4
  if (title.includes('verify you are human')) score += 4

  // IDs e classes comuns
  const selectors = [
    '#challenge-running',
    '#challenge-stage',
    '#cf-challenge-running',
    '#cf-spinner-please-wait',
    '#cf-please-wait',
    '#cf-error-details',
    '.cf-browser-verification',
    '.cf-im-under-attack',
    "[data-translate='checking_browser']",
    "[data-translate='why_captcha_detail']",
  ]

  for (const selector of selectors) {
    if ($(selector).length > 0) {
      score += 5
    }
  }

  // Scripts do challenge
  $('script[src]').each((_, el) => {
    const src = ($(el).attr('src') ?? '').toLowerCase()

    if (
      src.includes('/cdn-cgi/challenge-platform/') ||
      src.includes('/cdn-cgi/scripts/')
    ) {
      score += 8
    }
  })

  // HTML completo em minúsculas
  const html = $.html().toLowerCase()

  const phrases = [
    'checking your browser',
    'verify you are human',
    'please wait while we verify',
    'please enable javascript',
    'performance & security by cloudflare',
    'ddos protection by cloudflare',
    'ray id:',
    '/cdn-cgi/challenge-platform/',
    '__cf_chl_',
    'cf_chl_opt',
    'cf-ray',
    'cf_clearance',
  ]

  for (const phrase of phrases) {
    if (html.includes(phrase)) {
      score += 2
    }
  }

  // Score >= 8 indica alta probabilidade de ser um challenge do Cloudflare
  return score >= 8
}
