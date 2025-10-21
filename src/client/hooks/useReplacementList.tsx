import { useContext } from 'react'
import { ReplacementListContext } from '../context/replacement-list/context.ts'

export const useReplacementList = () => {
  const context = useContext(ReplacementListContext)
  return context
}
