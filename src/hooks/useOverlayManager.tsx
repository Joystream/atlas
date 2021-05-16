import React, { useCallback, useContext, useState, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/react'
import { transitions, zIndex } from '@/shared/theme'

type OverlayManagerContextValue = {
  scrollLocked: boolean
  setScrollLocked: (value: boolean, scrollbarGap?: number) => void
  overlayContainerOpenedForMessageDialog: boolean
  setOverlayContainerOpenedForMessageDialog: (value: boolean) => void
  setOverlayContainerOpenedForActionDialog: (value: boolean) => void
  messageDialogContainerRef: React.RefObject<HTMLDivElement>
  contextMenuContainerRef: React.RefObject<HTMLDivElement>
  actionDialogContainerRef: React.RefObject<HTMLDivElement>
}

type OverlayContainerProps = {
  isOpened?: boolean
}

const OverlayManagerContext = React.createContext<OverlayManagerContextValue | undefined>(undefined)
OverlayManagerContext.displayName = 'OverlayManagerContext'

export const OverlayManagerProvider: React.FC = ({ children }) => {
  const [scrollLocked, setScrollLocked] = useState(false)
  const [overlayContainerOpenedForMessageDialog, setOverlayContainerOpenedForMessageDialog] = useState(false)
  const [overlayContainerOpenedForActionDialog, setOverlayContainerOpenedForActionDialog] = useState(false)
  const [scrollbarGap, setScrollbarGap] = useState(0)
  const messageDialogContainerRef = useRef<HTMLDivElement>(null)
  const contextMenuContainerRef = useRef<HTMLDivElement>(null)
  const actionDialogContainerRef = useRef<HTMLDivElement>(null)
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

  const handleContainerOpenedForMessageDialog = useCallback((value: boolean) => {
    setOverlayContainerOpenedForMessageDialog(value)
  }, [])

  const handleContainerOpenedForActionDialog = useCallback((value: boolean) => {
    setOverlayContainerOpenedForActionDialog(value)
  }, [])

  return (
    <>
      <Global styles={[overlayManagerStyles(scrollbarGap), dialogTransitions]} />
      <OverlayManagerContext.Provider
        value={{
          actionDialogContainerRef,
          scrollLocked,
          setScrollLocked: handleScrollLocked,
          overlayContainerOpenedForMessageDialog,
          setOverlayContainerOpenedForMessageDialog: handleContainerOpenedForMessageDialog,
          setOverlayContainerOpenedForActionDialog: handleContainerOpenedForActionDialog,
          messageDialogContainerRef,
          contextMenuContainerRef,
        }}
      >
        {children}
        <StyledContextMenuContainer ref={contextMenuContainerRef} />
        <StyledOverlayContainer ref={actionDialogContainerRef} isOpened={overlayContainerOpenedForActionDialog} />
        <StyledOverlayContainer ref={messageDialogContainerRef} isOpened={overlayContainerOpenedForMessageDialog} />
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
  const {
    setScrollLocked,
    setOverlayContainerOpenedForMessageDialog,
    messageDialogContainerRef,
    contextMenuContainerRef,
    actionDialogContainerRef,
    setOverlayContainerOpenedForActionDialog,
  } = context

  const lockScroll = useCallback(() => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth
    setScrollLocked(true, scrollbarGap)
  }, [setScrollLocked])

  const unlockScroll = useCallback(() => {
    setScrollLocked(false)
  }, [setScrollLocked])

  const openOverlayContainerForMessageDialog = useCallback(() => {
    setOverlayContainerOpenedForMessageDialog(true)
  }, [setOverlayContainerOpenedForMessageDialog])

  const closeOverlayContainerForMessageDialog = useCallback(() => {
    setOverlayContainerOpenedForMessageDialog(false)
  }, [setOverlayContainerOpenedForMessageDialog])

  const openOverlayContainerForActionDialog = useCallback(() => {
    setOverlayContainerOpenedForActionDialog(true)
  }, [setOverlayContainerOpenedForActionDialog])

  const closeOverlayContainerForActionDialog = useCallback(() => {
    setOverlayContainerOpenedForActionDialog(false)
  }, [setOverlayContainerOpenedForActionDialog])

  return {
    lockScroll,
    unlockScroll,
    openOverlayContainerForMessageDialog,
    closeOverlayContainerForMessageDialog,
    openOverlayContainerForActionDialog,
    closeOverlayContainerForActionDialog,
    messageDialogContainerRef,
    contextMenuContainerRef,
    actionDialogContainerRef,
  }
}
