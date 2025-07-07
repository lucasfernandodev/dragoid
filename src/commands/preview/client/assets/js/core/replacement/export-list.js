export const exportList = (list = {}, name = '') => {
  const jsonString = JSON.stringify(list, null, 2);
  const blob = new Blob([jsonString], {type: 'application/json'})
  const url = URL.createObjectURL(blob);

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.href = url;
  downloadAnchorNode.download = `${name}.json`

  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click()
  downloadAnchorNode.remove()

  URL.revokeObjectURL(url)
}