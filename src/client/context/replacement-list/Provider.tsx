
import { ReplacementListcontext } from "./context.ts"
import type { ReplacementList } from "../../../types/front-end/replacement-list.ts"
import { useLocalStorage } from "../../hooks/useLocalStorage.ts";
import { useCallback } from "react";

export const ReplacementListProvider = ({ children }: { children: React.ReactNode }) => {
  const [collection, setCollection] = useLocalStorage('replacement-collection', [] as ReplacementList[]);
  const [activeList, setActiveList] = useLocalStorage<null | string>('active-replacement-list', null);

  const getList = (id: string) => collection.find(list => list.id === id) || null

  const getCollection = () => collection

  const addList = (id: string, data?: ReplacementList['list']) => {
    const newList = { id: id, list: data ?? {} }
    setCollection(old => ([...old, newList]))
  }

  const deleteList = (id: string) => {
    setCollection(collection => collection.filter(list => list.id !== id))
  }

  const updateList = (id: string, data: ReplacementList['list']) => {
    setCollection(old => old.map(
      list => list.id === id ? { id: id, list: data } : list
    ))
  }

  const toggleListActive = (id: string) => {
    if (activeList === id) {
      setActiveList(null)
    } else {
      setActiveList(id)
    }
  }

  const getAtiveList = useCallback(() => collection.find(list => list.id === activeList) || null, [activeList, collection])

  return (
    <ReplacementListcontext.Provider value={{
      getList: getList,
      getCollection: getCollection,
      addList: addList,
      toggleListActive: toggleListActive,
      getActiveList: getAtiveList,
      deleteList: deleteList,
      updateList: updateList
    }}>
      {children}
    </ReplacementListcontext.Provider>
  )
}