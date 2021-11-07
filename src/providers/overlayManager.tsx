import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import { transitions } from '@/theme'
import { createId } from '@/utils/createId'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setOverlaysSet: React.Dispatch<React.SetStateAction<Set<string>>>
  modalContainerRef: React.RefObject<HTMLDivElement>
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const [overlaysSet, setOverlaysSet] = useState(new Set<string>())

  const modalContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overlaysSet.size === 0 && scrollLocked) {
      setScrollLocked(false)
      setScrollbarGap(0)
      enablePageScroll()
    } else if (overlaysSet.size > 0 && !scrollLocked) {
      const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
      setScrollLocked(true)
      setScrollbarGap(scrollbarGap)
      disablePageScroll()
    }
  }, [overlaysSet.size, scrollLocked])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), modalTransitions]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          setOverlaysSet,
          modalContainerRef,
        }}
      >
        {children}

        <PortalContainer ref={modalContainerRef} />
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
  const { setOverlaysSet, modalContainerRef } = context

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
    modalContainerRef,
  }
}

const overlayManagerStyles = (scrollbarGap = 0) => css`
  :root {
    --size-scrollbar-width: ${scrollbarGap}px;
  }

  body {
    overflow-y: scroll;
  }
`

const modalTransitions = css`
  &.${transitions.names.modal}-enter {
    opacity: 0;
    transform: scale(0.88);
  }

  &.${transitions.names.modal}-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }

  &.${transitions.names.modal}-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.${transitions.names.modal}-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`
