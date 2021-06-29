import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { transitions } from '@/shared/theme'
import { createId } from '@/utils/createId'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setOverlaysSet: React.Dispatch<React.SetStateAction<Set<string>>>
  dialogContainerRef: React.RefObject<HTMLDivElement>
  contextMenuContainerRef: React.RefObject<HTMLDivElement>
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const [overlaysSet, setOverlaysSet] = useState(new Set<string>())

  const dialogContainerRef = useRef<HTMLDivElement>(null)
  const contextMenuContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overlaysSet.size === 0 && scrollLocked) {
      setScrollLocked(false)
      setScrollbarGap(0)
      enableBodyScroll(document.body)
    } else if (overlaysSet.size > 0 && !scrollLocked) {
      const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
      setScrollLocked(true)
      setScrollbarGap(scrollbarGap)
      disableBodyScroll(document.body, { reserveScrollBarGap: true })
    }
  }, [overlaysSet.size, scrollLocked])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), dialogTransitions]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          setOverlaysSet,
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
  const { setOverlaysSet, dialogContainerRef, contextMenuContainerRef } = context

  const overlayId = useRef(createId()).current
  const incrementOverlaysOpenCount = useCallback(() => {
    setOverlaysSet((prevSet) => new Set(prevSet).add(overlayId))
  }, [setOverlaysSet, overlayId])

  const decrementOverlaysOpenCount = useCallback(() => {
    setOverlaysSet((prevSet) => {
      prevSet.delete(overlayId)
      return new Set(prevSet)
    })
  }, [overlayId, setOverlaysSet])

  return {
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    dialogContainerRef,
    contextMenuContainerRef,
  }
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
