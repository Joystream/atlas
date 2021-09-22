import { useEffect, useRef, useState } from 'react'

export const useContextMenu = <T extends HTMLElement = HTMLButtonElement>() => {
  const [isVisible, setIsVisible] = useState(false)
  const targetRef = useRef<T>(null)

  useEffect(() => {
    if (!isVisible) {
      return
    }
    const closeContextMenu = () => setIsVisible(false)
    document.addEventListener('click', closeContextMenu, { once: true, capture: true })
  }, [isVisible])

  return {
    targetRef,
    openContextMenu: () => setIsVisible(true),
    closeContextMenu: () => setIsVisible(false),
    isVisible,
  }
}
