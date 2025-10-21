export const cn = (...args: (string | undefined)[]) => {
  return [...args].filter((o) => o).join(' ')
}
