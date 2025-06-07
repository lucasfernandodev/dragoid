export const getSiteName = (url: string): string => {
  const urlObject = new URL(url);
  const urlDomain = urlObject.hostname;
  const siteName = urlDomain.split('.').length === 3 ? urlDomain.split('.')[1] : urlDomain.split('.')[0]
  return siteName;
}