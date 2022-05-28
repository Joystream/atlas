import styled from '@emotion/styled'
import { FC } from 'react'

import { SvgActionChevronB } from '@/components/_icons'
import { transitions } from '@/styles'

import { Button, ButtonProps } from '../Button'

type ExpandButtonProps = {
  expanded?: boolean
} & Omit<ButtonProps, 'icon' | 'variant' | 'children'>

export const ExpandButton: FC<ExpandButtonProps> = ({ expanded, ...iconButtonProps }) => {
  return <StyledButton {...iconButtonProps} icon={<SvgActionChevronB />} expanded={expanded} variant="tertiary" />
}

export const StyledButton = styled(Button)<ExpandButtonProps>`
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0')});
  transform-origin: center;
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`
