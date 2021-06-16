import { SerializedStyles } from '@emotion/react'
import React from 'react'

import { Hamburger, HamburgerInner, HamburgerBox } from './HamburgerButton.style'

export type HamburgerButtonProps = {
  active: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  outerStyles?: SerializedStyles
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ active, onClick }) => {
  return (
    <Hamburger onClick={onClick} aria-label="Main menu" aria-expanded={active}>
      <HamburgerBox>
        <HamburgerInner active={active} />
      </HamburgerBox>
    </Hamburger>
  )
}
