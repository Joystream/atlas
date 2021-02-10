import React, { useCallback, useContext, useState, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { CSSTransition } from 'react-transition-group'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { breakpoints, zIndex } from '@/shared/theme'
import { dialogTransitions } from '@/shared/components/Dialog/Dialog.style'

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
        <CSSTransition in={overlayOpen} timeout={250} classNames="backdrop" unmountOnExit mountOnEnter>
          <StyledOverlayContainer
            ref={overlayContainerRef}
            className="backdrop"
            css={dialogTransitions}
          ></StyledOverlayContainer>
        </CSSTransition>
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: ${zIndex.globalOverlay};
  @media (min-width: ${breakpoints.medium}) {
    padding-left: var(--scrollbar-gap-width);
  }
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

  return { handleOverlayOpen, handleOverlayClose, overlayContainerRef }
}
