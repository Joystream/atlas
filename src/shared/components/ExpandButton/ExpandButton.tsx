import React from 'react'
import styled from '@emotion/styled'
import { Button } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { ButtonProps } from '../Button/Button'

type ExpandButtonProps = {
  expanded?: boolean
} & ButtonProps

const ExpandButton: React.FC<ExpandButtonProps> = ({ expanded, ...buttonProps }) => {
  return <StyledButton {...buttonProps} expanded={expanded} variant="tertiary" icon="chevron-down" size="large" />
}

export const StyledButton = styled(Button)<ExpandButtonProps>`
  transform: rotate(${({ expanded }) => (expanded ? '180deg' : '0')});
  transform-origin: center;
  transition: transform ${transitions.timings.regular} ${transitions.easing};
`

export default ExpandButton
