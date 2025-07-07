import { ReplacementStorage } from "../../../core/replacement/storage.js";
import { parseReplacementList } from "../../../core/replacement/validation/parse-replacement-list.js";

export const EditorReplacementService = () => {
  return {
    getList: (id) => {
      const storage = new ReplacementStorage();
      const list = storage.get(id)
      return list;
    },
    updateReplacementList: (id, list) => {
      let response = { error: false, data: null, message: null }

      const parsedData = parseReplacementList(list);
      if (parsedData.error) {
        response = {
          ...parsedData
        }
        return response;
      };

      const storage = new ReplacementStorage();
      const originalList = storage.get(id) || {}

      const isValidList = list.length === Object.keys(parsedData.data).length
      const isListUpdated = JSON.stringify(originalList) !== JSON.stringify(parsedData.data)

      if (isValidList && isListUpdated) {
        storage.update(id, parsedData.data);
      }
      return response
    },
  }
}