export const readUploadFile = (file) => {
  return new Promise((resolv, reject) => {
    let reader = new FileReader();
    reader.onload = (ev) => {
      resolv(ev.target.result)
    };
    reader.readAsText(file);
  })
}