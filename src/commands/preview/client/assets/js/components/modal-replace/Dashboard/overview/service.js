import { exportList } from "../../../../core/replacement/export-list.js";
import { ReplacementStorage } from "../../../../core/replacement/storage.js";

export const OverviewReplacementServices = () => {
  const storage = new ReplacementStorage();

  return {
    getAllIds: () => {
      const ids = storage.getAllIds()
      return ids.reverse()
    },
    deleteList: (id) => {
      storage.delete(id)
      if (window.localStorage.getItem('replacement-list-active')) {
        window.localStorage.removeItem('replacement-list-active', id);
      }
    },
    exportList: (id) => {
      const list = storage.get(id);
      exportList({ [id]: list }, id);
    },
    getActiveListId: () => {
      return window.localStorage.getItem('replacement-list-active');
    },
    setActiveListId: (id) => {
      window.localStorage.setItem('replacement-list-active', id);
    },
    removeActiveListId: (id) => {
      window.localStorage.removeItem('replacement-list-active', id);
    }
  }
}