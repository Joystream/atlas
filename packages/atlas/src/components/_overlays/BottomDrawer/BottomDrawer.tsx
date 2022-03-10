import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { ActionBarProps } from '@/components/ActionBar'
import { DrawerHeader } from '@/components/DrawerHeader'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar } from '@/styles'

import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './BottomDrawer.styles'

export type BottomDrawerProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  titleLabel?: string
  actionBar?: ActionBarProps
  coverTopbar?: boolean
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  titleLabel,
  children,
  actionBar: actionBarProps,
  coverTopbar,
}) => {
  const headTags = useHeadTags(title)

  const [cachedIsOpen, setCachedIsOpen] = useState(false)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  const actionBarActive = actionBarProps?.variant === 'edit' ? !actionBarProps.primaryButton?.disabled : true
  const { ref: actionBarRef, height: _actionBarHeight } = useResizeObserver({ box: 'border-box' })
  const actionBarHeight = actionBarActive ? _actionBarHeight : 0

  useEffect(() => {
    if (isOpen === cachedIsOpen) return

    setCachedIsOpen(isOpen)

    if (isOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [cachedIsOpen, decrementOverlaysOpenCount, incrementOverlaysOpenCount, isOpen])

  return (
    <>
      {isOpen ? headTags : null}
      <CSSTransition
        in={isOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="bottom-drawer-overlay"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={isOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={{ enter: 0, exit: parseInt(cVar('animationTimingSlow', true)) }}
        classNames="bottom-drawer"
      >
        <Container role="dialog" coverTopbar={!!coverTopbar}>
          <DrawerHeader title={title} label={titleLabel} onCloseClick={onClose} />
          <ScrollContainer actionBarHeight={actionBarHeight}>{children}</ScrollContainer>
          {actionBarProps ? <StyledActionBar ref={actionBarRef} {...actionBarProps} /> : null}
        </Container>
      </CSSTransition>
    </>
  )
}
