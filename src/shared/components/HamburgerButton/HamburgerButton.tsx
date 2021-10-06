import { SerializedStyles } from '@emotion/react'
import React from 'react'

import { Hamburger, HamburgerBox, HamburgerInner } from './HamburgerButton.style'

export type HamburgerButtonProps = {
  active: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  outerStyles?: SerializedStyles
  className?: string
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ active, onClick, className }) => {
  return (
    <Hamburger tabIndex={1} onClick={onClick} aria-label="Main menu" aria-expanded={active} className={className}>
      <HamburgerBox>
        <HamburgerInner active={active} />
      </HamburgerBox>
    </Hamburger>
  )
}
