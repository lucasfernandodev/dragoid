export const parseReplacementId = (id) => {
  const response = { error: false, data: null, message: null };

  if (!id.trim()) {
    response.error = true;
    response.message = 'Invalid list name, do not leave the field empty.'
    return response;
  }

  const allowChars = /^[a-zA-Z0-9 _-]+$/
  if (!allowChars.test(id)) {
    response.error = true;
    response.message = 'Invalid characters detected. Only letters (a–z, A–Z), numbers (0–9), spaces, underscores (_) and hyphens (-) are allowed.'
    return response;
  }

  if (id.length > 255) {
    response.error = true;
    response.message = 'Input too long. The maximum allowed length is 255 characters.'
    return response;
  }

  if (response.error === false) {
    response.data = id
  }

  return response;
}