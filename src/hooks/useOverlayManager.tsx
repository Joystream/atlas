import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { transitions } from '@/shared/theme'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setOverlaysOpenCount: React.Dispatch<React.SetStateAction<number>>
  dialogContainerRef: React.RefObject<HTMLDivElement>
  contextMenuContainerRef: React.RefObject<HTMLDivElement>
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const [overlaysOpenCount, setOverlaysOpenCount] = useState(0)
  const dialogContainerRef = useRef<HTMLDivElement>(null)
  const contextMenuContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overlaysOpenCount === 0 && scrollLocked) {
      setScrollLocked(false)
      setScrollbarGap(0)
      enableBodyScroll(document.body)
    } else if (overlaysOpenCount > 0 && !scrollLocked) {
      const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
      setScrollLocked(true)
      setScrollbarGap(scrollbarGap)
      disableBodyScroll(document.body, { reserveScrollBarGap: true })
    }
  }, [overlaysOpenCount, scrollLocked])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), dialogTransitions]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          setOverlaysOpenCount,
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
  const { setOverlaysOpenCount, dialogContainerRef, contextMenuContainerRef } = context

  const incrementOverlaysOpenCount = useCallback(() => setOverlaysOpenCount((count) => count + 1), [
    setOverlaysOpenCount,
  ])
  const decrementOverlaysOpenCount = useCallback(() => setOverlaysOpenCount((count) => count - 1), [
    setOverlaysOpenCount,
  ])

  return {
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    dialogContainerRef,
    contextMenuContainerRef,
  }
}
