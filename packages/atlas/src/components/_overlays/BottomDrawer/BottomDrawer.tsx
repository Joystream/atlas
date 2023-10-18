import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { ActionBar, ActionBarProps } from '@/components/ActionBar'
import { DrawerHeader } from '@/components/DrawerHeader'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar } from '@/styles'

import { Container, DrawerOverlay, Inner, Outer } from './BottomDrawer.styles'

export type BottomDrawerProps = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
  title?: string
  titleLabel?: string
  pageTitle?: string
  actionBar?: ActionBarProps
  fixedScrollbar?: boolean
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
}) => {
  const headTags = useHeadTags(pageTitle || title)

  const [cachedIsOpen, setCachedIsOpen] = useState(false)
  const { lastOverlayId, decrementOverlaysOpenCount, incrementOverlaysOpenCount } = useOverlayManager()
  const [overlayId, setOverlayId] = useState<string | null>(null)

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
        <Container role="dialog">
          <DrawerHeader title={title} label={titleLabel} onCloseClick={onClose} />
          <Outer>
            <Inner fixedScrollbar={fixedScrollbar} data-scroll-lock-scrollable>
              {children}
            </Inner>
          </Outer>

          {actionBar ? <ActionBar {...actionBar} /> : null}
        </Container>
      </CSSTransition>
    </>
  )
}
