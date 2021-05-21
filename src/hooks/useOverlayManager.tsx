import React, { useCallback, useContext, useState, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { zIndex } from '@/shared/theme'
import { transitionStyles } from '@/shared/components/GlobalStyle/transitionStyles'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setScrollLocked: (value: boolean, scrollbarGap?: number) => void
  overlayContainerOpened: boolean
  setOverlayContainerOpened: (value: boolean) => void
  overlayContainerRef: React.RefObject<HTMLDivElement>
  contextMenuContainerRef: React.RefObject<HTMLDivElement>
}

type OverlayContainerProps = {
  isOpened?: boolean
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [overlayContainerOpened, setOverlayContainerOpened] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const overlayContainerRef = useRef<HTMLDivElement>(null)
  const contextMenuContainerRef = useRef<HTMLDivElement>(null)
  const handleScrollLocked = useCallback((value: boolean, scrollbarGap?: number) => {
    if (value) {
      setScrollLocked(true)
      setScrollbarGap(scrollbarGap || 0)
      disableBodyScroll(document.body, { reserveScrollBarGap: true })
    } else {
      setScrollLocked(false)
      setScrollbarGap(0)
      enableBodyScroll(document.body)
    }
  }, [])

  const handleContainerOpened = useCallback((value: boolean) => {
    setOverlayContainerOpened(value)
  }, [])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), transitionStyles]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          setScrollLocked: handleScrollLocked,
          overlayContainerOpened,
          setOverlayContainerOpened: handleContainerOpened,
          overlayContainerRef,
          contextMenuContainerRef,
        }}
      >
        {children}
        <StyledContextMenuContainer ref={contextMenuContainerRef}></StyledContextMenuContainer>
        <StyledOverlayContainer ref={overlayContainerRef} isOpened={overlayContainerOpened}></StyledOverlayContainer>
      </OverlayManagerContext.Provider>
    </>
  )
}

const overlayManagerStyles = (scrollbarGap = 0) => css`
  :root {
    --scrollbar-gap-width: ${scrollbarGap}px;
  }

  body {
    overflow-y: scroll;
  }
`
const StyledContextMenuContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`
const StyledOverlayContainer = styled.div<OverlayContainerProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  visibility: ${({ isOpened }) => (isOpened ? 'visible' : 'hidden')};
  opacity: ${({ isOpened }) => (isOpened ? '1' : '0')};
  z-index: ${zIndex.globalOverlay};
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
`

export const useOverlayManager = () => {
  const context = useContext(OverlayManagerContext)
  if (!context) {
    throw new Error(`useOverlayManager must be used within a OverlayManagerProvider.`)
  }
  const { setScrollLocked, setOverlayContainerOpened, overlayContainerRef, contextMenuContainerRef } = context

  const lockScroll = useCallback(() => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    setScrollLocked(true, scrollbarGap)
  }, [setScrollLocked])

  const unlockScroll = useCallback(() => {
    setScrollLocked(false)
  }, [setScrollLocked])

  const openOverlayContainer = useCallback(() => {
    setOverlayContainerOpened(true)
  }, [setOverlayContainerOpened])

  const closeOverlayContainer = useCallback(() => {
    setOverlayContainerOpened(false)
  }, [setOverlayContainerOpened])

  return {
    lockScroll,
    unlockScroll,
    openOverlayContainer,
    closeOverlayContainer,
    overlayContainerRef,
    contextMenuContainerRef,
  }
}
