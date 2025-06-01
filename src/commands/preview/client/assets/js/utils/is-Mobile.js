export const isMobile = () => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const isMobile = computedStyle.getPropertyValue('--is-mobile').trim();
  const value = Number.parseInt(isMobile || '0');
  return value === 1 ? true : false;
}