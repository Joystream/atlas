import styled from '@emotion/styled'
import React from 'react'

import { SvgGlyphChevronDown } from '@/components/icons'
import { transitions } from '@/theme'

import { IconButton, IconButtonProps } from '../IconButton'

type ExpandButtonProps = {
  expanded?: boolean
} & Omit<IconButtonProps, 'icon' | 'variant' | 'children'>

export const ExpandButton: React.FC<ExpandButtonProps> = ({ expanded, ...iconButtonProps }) => {
  return (
    <StyledButton {...iconButtonProps} expanded={expanded} variant="tertiary">
      <SvgGlyphChevronDown />
    </StyledButton>
  )
}

export const StyledButton = styled(IconButton)<ExpandButtonProps>`
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0')});
  transform-origin: center;
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`
