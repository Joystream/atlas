import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes, colors, transitions } from '../../theme'
import { ButtonVariant } from '../ButtonBase'

export type ToggleButtonStyleProps = {
  toggled: boolean
  disabled?: boolean
  variant: ButtonVariant
}

const hoverTransition = ({ toggled, disabled = false }: ToggleButtonStyleProps) =>
  !toggled && !disabled
    ? css`
        &:hover {
          transform: translate3d(-${sizes(1)}, -${sizes(1)}, 0);
          box-shadow: ${sizes(1)} ${sizes(1)} 0 ${colors.blue[500]};
        }
      `
    : null

const pressedStyles = ({ toggled }: ToggleButtonStyleProps) =>
  toggled
    ? css`
        border-color: ${colors.white};
        background-color: ${colors.blue[500]};

        &:hover {
          background-color: ${colors.blue[700]};
        }

        &:active {
          background-color: ${colors.blue[900]};
        }
      `
    : null

export const StyledToggleButton = styled.button`
  color: ${colors.blue[50]};
  background-color: transparent;
  padding: ${sizes(3.5)} ${sizes(5)};
  cursor: pointer;
  border: 1px solid ${colors.blue[500]};

  &:hover {
    border-color: ${colors.blue[50]};
  }

  &:active {
    border-color: ${colors.blue[50]};
    background-color: ${colors.blue[500]};
  }

  transition: all 0.4s ${transitions.easing};
  ${pressedStyles}
  ${hoverTransition}
`
