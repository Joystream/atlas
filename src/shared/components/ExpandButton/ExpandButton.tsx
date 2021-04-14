import React from 'react'
import styled from '@emotion/styled'
import IconButton, { IconButtonProps } from '../IconButton'
import { transitions } from '@/shared/theme'

type ExpandButtonProps = {
  expanded?: boolean
} & Omit<IconButtonProps, 'icon' | 'size' | 'variant'>

const ExpandButton: React.FC<ExpandButtonProps> = ({ expanded, ...iconButtonProps }) => {
  return <StyledButton {...iconButtonProps} expanded={expanded} variant="tertiary" icon="chevron-down" size="large" />
}

export const StyledButton = styled(IconButton)<ExpandButtonProps>`
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0')});
  transform-origin: center;
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`

export default ExpandButton
