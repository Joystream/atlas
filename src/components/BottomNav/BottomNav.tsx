import React, { useEffect, useRef, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { viewerNavItems } from '@/config/nav'
import { transitions } from '@/shared/theme'

import { Container, NavLink, NavTitle } from './BottomNav.style'

export const BottomNav = () => {
  const [open, setOpen] = useState(true)
  const match = useMatch
  const pageYOffsetRef = useRef<number | null>(null)

  const toggleNavbar = () => {
    const scrollRange = pageYOffsetRef.current !== null ? window.scrollY - pageYOffsetRef.current : 0
    if (scrollRange >= 64) {
      setOpen(false)
    }
    if (scrollRange <= -24) {
      setOpen(true)
    }
    if (Math.abs(scrollRange) >= 64 || pageYOffsetRef.current === null) {
      pageYOffsetRef.current = window.scrollY
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleNavbar)

    return () => {
      window.removeEventListener('scroll', toggleNavbar)
    }
  }, [])

  return (
    <CSSTransition
      in={open}
      timeout={parseInt(transitions.timings.routing)}
      classNames="bottom-nav"
      unmountOnExit
      mountOnEnter
    >
      <Container>
        {viewerNavItems.map((item) => (
          <NavLink to={item.to} key={`bottomLink-${item.to}`} active={match(item.to)}>
            {item.icon}
            <NavTitle variant="button3">{item.name}</NavTitle>
          </NavLink>
        ))}
      </Container>
    </CSSTransition>
  )
}
