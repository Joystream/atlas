import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import { createId } from '@/utils/createId'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  anyOverlaysOpen: boolean
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

  const anyOverlaysOpen = overlaysSet.size > 0

  useEffect(() => {
    if (!anyOverlaysOpen && scrollLocked) {
      setScrollLocked(false)
      setScrollbarGap(0)
      enablePageScroll()
    } else if (anyOverlaysOpen && !scrollLocked) {
      const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
      setScrollLocked(true)
      setScrollbarGap(scrollbarGap)
      disablePageScroll()
    }
  }, [anyOverlaysOpen, scrollLocked])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap)]} />
      <OverlayManagerContext.Provider
        value={{
          scrollLocked,
          anyOverlaysOpen,
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
  const { setOverlaysSet, modalContainerRef, anyOverlaysOpen } = context

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
    anyOverlaysOpen,
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
