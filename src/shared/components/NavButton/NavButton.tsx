import { SerializedStyles } from '@emotion/react'
import React from 'react'

import { IconButton } from '@/shared/components'
import { SvgGlyphChevronLeft, SvgGlyphChevronRight } from '@/shared/icons'

export type NavButtonProps = {
  direction: 'right' | 'left'
  outerCss: SerializedStyles | (SerializedStyles | undefined)[]
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const NavButton: React.FC<Partial<NavButtonProps>> = ({ direction = 'right', onClick, outerCss }) => {
  return (
    <IconButton css={outerCss} onClick={onClick} size="large">
      {direction === 'right' ? <SvgGlyphChevronRight /> : <SvgGlyphChevronLeft />}
    </IconButton>
  )
}
