import styled from '@emotion/styled'
import React from 'react'

import { SvgActionChevronB } from '@/components/_icons'
import { transitions } from '@/styles'

import { Button, ButtonProps } from '../Button'

type ExpandButtonProps = {
  expanded?: boolean
} & Omit<ButtonProps, 'icon' | 'variant' | 'children'>

export const ExpandButton: React.FC<ExpandButtonProps> = ({ expanded, ...iconButtonProps }) => {
  return (
    <StyledButton {...iconButtonProps} expanded={expanded} variant="tertiary">
      <SvgActionChevronB />
    </StyledButton>
  )
}

export const StyledButton = styled(Button)<ExpandButtonProps>`
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0')});
  transform-origin: center;
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`
