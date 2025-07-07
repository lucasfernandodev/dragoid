export const parseReplacementList = (data) => {
  let index = 0;
  const response = { error: false, data: null, message: null, index: 0, key: 'text' };
  const parsedData = {}

  for (const [text, replace] of data) {
    if (!text.trim()) {
      response.error = true
      response.message = 'Field cannot be empty'
      response.index = index;
      break;
    }

    if (text.trim().length > 255) {
      response.error = true
      response.message = 'The maximum number of characters is 255'
      response.index = index;
      break;
    }

    if (typeof parsedData[text] !== 'undefined') {
      response.error = true
      response.message = 'Duplicate texts are not allowed.'
      response.index = index;
      break;
    }

    if (!replace.trim()) {
      response.error = true
      response.message = 'Field cannot be empty'
      response.index = index;
      response.key = 'replace'
      break;
    }

    if (replace.trim().length > 255) {
      response.error = true
      response.message = 'The maximum number of characters is 255'
      response.index = index;
      response.key = 'replace'
      break;
    }

    if (replace === text) {
      response.error = true
      response.message = 'The text and the word to be replaced cannot be the same.'
      response.index = index;
      response.key = 'replace'
      break;
    }


    // Creating List
    parsedData[text] = replace;
    // For showing index;
    index++
  }

  if (response.error === false) {
    response.data = parsedData;
  }

  return response;
}