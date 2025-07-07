import { ReplacementStorage } from "../../../../core/replacement/storage.js"
import { parseReplacementId } from "../../../../core/replacement/validation/parse-replacement-id.js"
import { parseReplacementList } from "../../../../core/replacement/validation/parse-replacement-list.js"
import { readUploadFile } from "../../../../utils/read-upload-file.js"


export const CreateReplacementListService = () => {
  const storage = new ReplacementStorage()
  return {
    add: (id) => {
      const response = { error: false, data: null, message: null };
      try {
        const isValid = parseReplacementId(id);

        if (!isValid.error) {
          storage.create(isValid.data);
          return response;
        }

        response.error = true;
        response.message = isValid.message
        return response;
      } catch (error) {
        response.error = true;
        response.message = error?.message
        return response;
      }
    },

    upload: async (file) => {
      const storage = new ReplacementStorage()
      const response = { error: false, data: null, message: null };

      const currentFile = await readUploadFile(file);

      try {
        const parsedJson = JSON.parse(currentFile);

        if (Object.keys(parsedJson).length !== 1) {
          response.error = true;
          response.message = 'File scheme invalid'
          return response;
        }

        const id = Object.keys(parsedJson)[0];
        const isValidId = parseReplacementId(id);

        if (isValidId.error) {
          response.error = true;
          response.message = isValidId.message;
          return response;
        }

        const list = parsedJson[id];
        const isValidList = parseReplacementList(Object.entries(list));

        if (isValidList.error) {
          response.error = true;
          response.message = isValidList.message;
          return response;
        }

        storage.create(id, list)

        response.data = {
          id,
          list
        }

        return response
      } catch (error) {
        response.error = true;
        response.message = error?.message;
        return response
      }
    }
  }
}