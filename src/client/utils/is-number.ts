export const isNumber = (n: unknown) => {
  if (typeof n !== 'number' && typeof n !== 'string') return false;
  return !isNaN(Number.parseInt(n as string))
}