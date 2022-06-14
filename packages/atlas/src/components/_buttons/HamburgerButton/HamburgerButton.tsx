import { SerializedStyles } from '@emotion/react'
import { FC, MouseEvent } from 'react'

import { Hamburger, HamburgerBox, HamburgerInner } from './HamburgerButton.styles'

export type HamburgerButtonProps = {
  active: boolean
  onClick: (e: MouseEvent<HTMLElement>) => void
  outerStyles?: SerializedStyles
  className?: string
}

export const HamburgerButton: FC<HamburgerButtonProps> = ({ active, onClick, className }) => {
  return (
    <Hamburger
      tabIndex={1}
      variant="tertiary"
      size="large"
      onClick={onClick}
      aria-label="Main menu"
      aria-expanded={active}
      className={className}
      icon={
        <HamburgerBox>
          <HamburgerInner active={active} />
        </HamburgerBox>
      }
    />
  )
}
