export const generateNumber = (initial, end, step = 2) => {
  const result = [];
  for (let i = initial; i <= end; i += step) {
    result.push(i);
  }
  return result;
}