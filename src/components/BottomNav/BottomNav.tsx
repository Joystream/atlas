import React, { useEffect, useRef, useState } from 'react'
import { useMatch } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { navItems } from '@/config/nav'
import { transitions } from '@/shared/theme'

import { Container, NavLink, NavTitle } from './BottomNav.style'

export const BottomNav = () => {
  const [open, setOpen] = useState(false)
  const match = useMatch
  const pageYOffsetRef = useRef<number | null>(null)

  const toggleNavbar = () => {
    const scrollRange = pageYOffsetRef.current !== null ? window.pageYOffset - pageYOffsetRef.current : 0
    if (scrollRange >= 128) {
      setOpen(true)
    }
    if (scrollRange <= -128) {
      setOpen(false)
    }
    if (Math.abs(scrollRange) >= 128 || pageYOffsetRef.current === null) {
      pageYOffsetRef.current = window.pageYOffset
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
        {navItems.map((item) => (
          <NavLink to={item.to} key={`bottomLink-${item.to}`} active={match(item.to)}>
            {item.icon}
            <NavTitle>{item.name}</NavTitle>
          </NavLink>
        ))}
      </Container>
    </CSSTransition>
  )
}
