import { FC, useCallback, useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { viewerNavItems } from '@/components/_navigation/SidenavViewer'
import { useBottomNavStore } from '@/providers/bottomNav'
import { transitions } from '@/styles'

import { Container, NavLink, NavTitle } from './BottomNav.styles'

const Link: FC<(typeof viewerNavItems)[number]> = ({ to, icon, name }) => {
  const match = useMatch(to)
  return (
    <NavLink to={to} active={match}>
      {icon}
      <NavTitle as="span" variant="t100-strong">
        {name}
      </NavTitle>
    </NavLink>
  )
}

const OPENING_MARGIN = 24

export const BottomNav: FC = () => {
  const { open, setOpen } = useBottomNavStore((state) => ({ open: state.open, setOpen: state.actions.setOpen }))
  const pageYOffsetRef = useRef<number | null>(null)

  const toggleNavbar = useCallback(() => {
    /**
     * Some browsers allows to 'overscroll' page which causes bottom navigation wrong behavior.
     * This condition checks if user scrolled out of page in both directions, top and bottom.
     */
    if (window.scrollY < 0 || window.scrollY >= document.body.scrollHeight - window.innerHeight) {
      return
    }
    const scrollRange = pageYOffsetRef.current !== null ? window.scrollY - pageYOffsetRef.current : 0
    if (scrollRange >= OPENING_MARGIN) {
      setOpen(false)
    }
    if (scrollRange <= -OPENING_MARGIN) {
      setOpen(true)
    }
    if (Math.abs(scrollRange) >= OPENING_MARGIN || pageYOffsetRef.current === null) {
      pageYOffsetRef.current = window.scrollY
    }
  }, [setOpen])

  useEffect(() => {
    window.addEventListener('scroll', toggleNavbar)

    return () => {
      window.removeEventListener('scroll', toggleNavbar)
      setOpen(false)
    }
  }, [setOpen, toggleNavbar])

  return (
    <CSSTransition
      in={open}
      timeout={parseInt(transitions.timings.routing)}
      classNames="bottom-nav"
      unmountOnExit
      mountOnEnter
    >
      <Container>
        {viewerNavItems.map((item) => item.bottomNav && <Link {...item} key={`bottomLink-${item.to}`} />)}
      </Container>
    </CSSTransition>
  )
}
