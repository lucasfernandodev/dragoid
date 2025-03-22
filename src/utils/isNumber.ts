export const isNumber = (val: any): boolean => {
  return !isNaN(Number(val)) && Number.isFinite(Number(val));
};