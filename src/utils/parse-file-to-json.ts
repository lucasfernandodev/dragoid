export interface ParseFileJsonError {
  success: false;
  message: string
}

export const parseFileToJson = <T>(file: File): Promise<{ success: boolean, data?: T, message?: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject({
        success: false,
        message: 'Parse file failed! File not found'
      })
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e?.target?.result;

        if (!result) {
          return reject({
            success: false,
            message: 'File parse failed'
          })
          return;
        }

        if (typeof result !== 'string') {
          return reject({
            success: false,
            message: 'File parse invalid type'
          })
          return;
        }

        const json = JSON.parse(result)
        return resolve({
          success: true,
          data: json
        })
      } catch (error) {
        console.log('Parse file to json failed', error)
        if (error instanceof SyntaxError) {
          return reject({
            success: false,
            message: 'Invalid JSON format'
          });
        } else {
          return reject({
            success: false,
            message: 'Unknown error while parsing file'
          });
        }
      }
    }

    reader.readAsText(file)
  })
}