import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { ActionBarProps } from '@/components/ActionBar'
import { DrawerHeader } from '@/components/DrawerHeader'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar } from '@/styles'

import { Container, DrawerOverlay, ScrollContainer, StyledActionBar } from './BottomDrawer.styles'

export type BottomDrawerProps = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
  title?: string
  titleLabel?: string
  pageTitle?: string
  actionBar?: ActionBarProps
  fixedScrollbar?: boolean
  className?: string
}>

export const BottomDrawer: FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  title,
  titleLabel,
  pageTitle,
  children,
  actionBar,
  fixedScrollbar,
  className,
}) => {
  const headTags = useHeadTags(pageTitle || title)

  const [cachedIsOpen, setCachedIsOpen] = useState(false)
  const { lastOverlayId, decrementOverlaysOpenCount, incrementOverlaysOpenCount } = useOverlayManager()
  const [overlayId, setOverlayId] = useState<string | null>(null)

  const actionBarActive = actionBar?.isActive ?? true
  const { ref: actionBarRef, height: _actionBarHeight } = useResizeObserver({ box: 'border-box' })
  const actionBarHeight = actionBarActive ? _actionBarHeight : 0

  useEffect(() => {
    if (isOpen === cachedIsOpen) return

    setCachedIsOpen(isOpen)

    if (isOpen) {
      const id = incrementOverlaysOpenCount()
      setOverlayId(id)
    } else {
      decrementOverlaysOpenCount()
      setOverlayId(null)
    }
  }, [cachedIsOpen, decrementOverlaysOpenCount, incrementOverlaysOpenCount, isOpen])

  useEffect(() => {
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lastOverlayId === overlayId) {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscPress)

    return () => {
      document.removeEventListener('keydown', handleEscPress)
    }
  }, [lastOverlayId, onClose, overlayId])

  return (
    <>
      {isOpen ? headTags : null}
      <CSSTransition
        in={isOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={parseInt(cVar('animationTimingSlow', true))}
        classNames="bottom-drawer-overlay"
      >
        <DrawerOverlay />
      </CSSTransition>
      <CSSTransition
        in={isOpen}
        appear
        mountOnEnter
        unmountOnExit
        timeout={parseInt(cVar('animationTimingSlow', true))}
        classNames="bottom-drawer"
      >
        <Container role="dialog" className={className}>
          <DrawerHeader title={title} label={titleLabel} onCloseClick={onClose} />
          <ScrollContainer
            data-scroll-lock-scrollable
            actionBarHeight={actionBarHeight}
            fixedScrollbar={fixedScrollbar}
          >
            {children}
          </ScrollContainer>
          {actionBar ? <StyledActionBar ref={actionBarRef} {...actionBar} /> : null}
        </Container>
      </CSSTransition>
    </>
  )
}
