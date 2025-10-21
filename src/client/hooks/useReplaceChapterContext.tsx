import { useEffect } from 'react'
import { useReplacementList } from './useReplacementList.tsx'
import { useLocation } from 'react-router-dom'
import { walkeToReplace } from '../utils/wake-to-replace.tsx'

interface Props {
  targetRef: {
    current: HTMLElement | null
  }
}

export const useReplaceChapterContent = ({ targetRef }: Props) => {
  const { getActiveList } = useReplacementList()
  const replacementList = getActiveList()

  const location = useLocation()

  useEffect(() => {
    const currentList = replacementList?.list

    if (
      !currentList ||
      !targetRef.current ||
      Object.keys(currentList).length === 0
    )
      return

    const targetNode = targetRef.current
    let timer: number | undefined
    let isChanging = false
    let lastHashContent = ''

    const applyReplacement = () => {
      isChanging = true
      const currentHash = targetNode.innerText
      if (currentHash !== lastHashContent) {
        walkeToReplace(targetNode, currentList)
        lastHashContent = targetNode.innerText
      }
      isChanging = false
    }

    applyReplacement()

    // Cria o observador e passa a função de callback
    const observer = new MutationObserver((mutations) => {
      if (isChanging) return
      if (
        mutations.some(
          (m) => m.type === 'childList' || m.type === 'characterData'
        )
      ) {
        clearTimeout(timer)
        timer = window.setTimeout(applyReplacement, 50)
      }
    })

    // Inicia a observação
    observer.observe(targetNode, {
      childList: true, // observar a adição/remoção de elementos filhos
      subtree: true,
      characterData: true,
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [targetRef, replacementList, location.pathname])
}
