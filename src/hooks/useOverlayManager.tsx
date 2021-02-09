import React, { useCallback, useContext, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { css, Global } from '@emotion/react'

type OverlayManagerContextValue = {
  overlayOpen: boolean
  setOverlayOpen: (value: boolean, scrollbarGap?: number) => void
}
const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)

  const handleOverlayOpen = (value: boolean, scrollbarGap?: number) => {
    if (value === overlayOpen) {
      return
    }

    if (value) {
      setOverlayOpen(true)
      setScrollbarGap(scrollbarGap || 0)
      disableBodyScroll(document.body, { reserveScrollBarGap: true })
    } else {
      setOverlayOpen(false)
      setScrollbarGap(0)
      enableBodyScroll(document.body)
    }
  }

  return (
    <>
      <Global styles={overlayManagerStyles(scrollbarGap)} />
      <OverlayManagerContext.Provider value={{ overlayOpen, setOverlayOpen: handleOverlayOpen }}>
        {children}
      </OverlayManagerContext.Provider>
    </>
  )
}

const overlayManagerStyles = (scrollbarGap = 0) => css`
  :root {
    --scrollbar-gap-width: ${scrollbarGap}px;
  }
`

export const useOverlayManager = () => {
  const context = useContext(OverlayManagerContext)
  if (!context) {
    throw new Error(`useOverlayManager must be used within a OverlayManagerProvider.`)
  }

  const { setOverlayOpen } = context

  const handleOverlayOpen = useCallback(() => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    setOverlayOpen(true, scrollbarGap)
  }, [setOverlayOpen])

  const handleOverlayClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  return { handleOverlayOpen, handleOverlayClose }
}
