export function isObjectWithStringValues(obj) {
  // 1. Verifica se é um objeto (não nulo e não array)
  if (
    typeof obj !== 'object' ||
    obj === null ||
    Array.isArray(obj)
  ) {
    return false;
  }

  // 2. Verifica se todos os valores são strings
  return Object.values(obj).every(value => typeof value === 'string');
}