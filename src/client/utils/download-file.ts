export const downloadFile = async (filename: string, data: Blob) => {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
