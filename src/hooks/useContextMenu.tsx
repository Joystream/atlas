import { useState, useCallback } from 'react'

export const useContextMenu = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, left: true })
  const [isActive, setMenuActive] = useState(false)

  const openContextMenu = useCallback((event) => {
    const clickPositionFromRight = document.body.clientWidth - event.pageX
    if (clickPositionFromRight > 200) {
      setPosition({ x: event.pageX - 72, y: event.pageY - 81, left: true })
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
