import { useCallback, useEffect, useState } from 'react'

export const useContextMenu = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, left: true })
  const [isActive, setMenuActive] = useState(false)

  useEffect(() => {
    if (!isActive) {
      return
    }
    const closeContextMenu = () => setMenuActive(false)
    document.addEventListener('click', closeContextMenu, { once: true, capture: true })
  }, [isActive])

  const openContextMenu = useCallback((event: React.MouseEvent, menuWidth: number) => {
    const clickPositionFromRight = document.body.clientWidth - event.pageX
    if (clickPositionFromRight > menuWidth) {
      setPosition({ x: event.pageX, y: event.pageY, left: true })
    } else {
      setPosition({ x: clickPositionFromRight, y: event.pageY, left: false })
    }
    setMenuActive(true)
  }, [])

  const closeContextMenu = useCallback(() => {
    setMenuActive(false)
  }, [])

  const contextMenuOpts = {
    isActive,
    position,
  }

  return { openContextMenu, closeContextMenu, contextMenuOpts }
}
