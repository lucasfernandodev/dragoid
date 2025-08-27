export const parseFileToJson = <T>(file: File): Promise<{ success: boolean, data?: T, message?: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      throw new Error('Parse file failed! File not found');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e?.target?.result;

        if (!result) {
          reject({
            success: false,
            message: 'File parse failed'
          })
          return;
        }

        if (typeof result !== 'string') {
          reject({
            success: false,
            message: 'File parse invalid type'
          })
          return;
        }

        const json = JSON.parse(result)
        resolve({
          success: true,
          data: json
        })
      } catch (error) {
        console.log('Parse file to json failed', error)
        if (error instanceof SyntaxError) {
          reject({
            success: false,
            message: 'Invalid JSON format'
          });
        } else {
          reject({
            success: false,
            message: 'Unknown error while parsing file'
          });
        }
      }
    }

    reader.readAsText(file)
  })
}