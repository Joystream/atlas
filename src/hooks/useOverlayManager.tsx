import React, { useCallback, useContext, useState, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { zIndex } from '@/shared/theme'

type OverlayManagerContextValue = {
  overlayOpen: boolean
  setOverlayOpen: (value: boolean, scrollbarGap?: number) => void
  overlayContainerRef: React.RefObject<HTMLDivElement>
}
const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const overlayContainerRef = useRef<HTMLDivElement>(null)

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
      <OverlayManagerContext.Provider value={{ overlayOpen, setOverlayOpen: handleOverlayOpen, overlayContainerRef }}>
        {children}
        <StyledOverlayContainer ref={overlayContainerRef}></StyledOverlayContainer>
      </OverlayManagerContext.Provider>
    </>
  )
}

const overlayManagerStyles = (scrollbarGap = 0) => css`
  :root {
    --scrollbar-gap-width: ${scrollbarGap}px;
  }
`

const StyledOverlayContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  visibility: hidden;
  opacity: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
`

export const useOverlayManager = () => {
  const context = useContext(OverlayManagerContext)
  if (!context) {
    throw new Error(`useOverlayManager must be used within a OverlayManagerProvider.`)
  }
  const { setOverlayOpen, overlayContainerRef } = context

  const handleOverlayOpen = useCallback(() => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    setOverlayOpen(true, scrollbarGap)
  }, [setOverlayOpen])

  const handleOverlayClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  const handleOverlayContainerOpen = useCallback(() => {
    if (overlayContainerRef.current === null) {
      return
    }
    overlayContainerRef.current.style.visibility = 'visible'
    overlayContainerRef.current.style.opacity = '1'
  }, [overlayContainerRef])

  const handleOverlayContainerClose = useCallback(() => {
    if (overlayContainerRef.current === null) {
      return
    }
    overlayContainerRef.current.style.opacity = '0'
    overlayContainerRef.current.style.visibility = 'hidden'
  }, [overlayContainerRef])

  return {
    handleOverlayOpen,
    handleOverlayClose,
    handleOverlayContainerOpen,
    handleOverlayContainerClose,
    overlayContainerRef,
  }
}
