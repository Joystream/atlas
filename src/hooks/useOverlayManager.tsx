import React, { useCallback, useContext, useState, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { transitions } from '@/shared/theme'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setScrollLocked: (value: boolean, scrollbarGap?: number) => void
  dialogContainerRef: React.RefObject<HTMLDivElement>
  contextMenuContainerRef: React.RefObject<HTMLDivElement>
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const dialogContainerRef = useRef<HTMLDivElement>(null)
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

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), dialogTransitions]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          setScrollLocked: handleScrollLocked,
          dialogContainerRef,
          contextMenuContainerRef,
        }}
      >
        {children}

        <PortalContainer ref={dialogContainerRef} />
        <PortalContainer ref={contextMenuContainerRef} />
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

const dialogTransitions = css`
  &.${transitions.names.dialog}-enter {
    opacity: 0;
    transform: scale(0.88);
  }

  &.${transitions.names.dialog}-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }

  &.${transitions.names.dialog}-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.${transitions.names.dialog}-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`

const PortalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`

export const useOverlayManager = () => {
  const context = useContext(OverlayManagerContext)
  if (!context) {
    throw new Error(`useOverlayManager must be used within a OverlayManagerProvider.`)
  }
  const { setScrollLocked, dialogContainerRef, contextMenuContainerRef } = context

  const lockScroll = useCallback(() => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    setScrollLocked(true, scrollbarGap)
  }, [setScrollLocked])

  const unlockScroll = useCallback(() => {
    setScrollLocked(false)
  }, [setScrollLocked])

  return {
    lockScroll,
    unlockScroll,
    dialogContainerRef,
    contextMenuContainerRef,
  }
}
