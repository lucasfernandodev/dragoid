import fs from 'node:fs/promises'

export function validURL(str: string) {
  let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

export const parseURL = (url: string) => {
  const isURLValid = validURL(url);
  if (!isURLValid) {
    console.error('Invalid URL');
    process.exit(1);
  }

  const urlObject = new URL(url);
  return urlObject
}

export const wating = (time: number = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export function removeTypesFromHelpCommand(err, args, output) {
  if (output) {
    // Remove types (e.g. [string], [boolean]) from the output
    output = output.replace(/\[\w+\]/g, '');

    // Show the modified output
    console.log(output);
  }
}


export const writeFile = async (filename: string, type: string, data: string) => {
  try {
    await fs.writeFile(`${filename}.${type}`, data);
    console.log(`File ${filename} has been written successfully.`);
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

export const exitsOnFechError = async (fetch: Promise<Response>) => {
  try {
    const response = await fetch;
    if (response.status !== 200) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      process.exit(1)
    }
    return response;
  } catch (error) {
    console.error('Unable to access the url, check if the url is correct and try again.')
    process.exit(1)
  }
}