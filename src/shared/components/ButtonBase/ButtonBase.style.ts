import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions } from '../../theme'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonBaseStyleProps = {
  variant: ButtonVariant
  size: ButtonSize
  clickable?: boolean
}

const variantStyles = ({ variant }: ButtonBaseStyleProps): SerializedStyles => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${colors.blue[500]};

        &:hover {
          background-color: ${colors.blue[700]};
        }

        &:active {
          background-color: ${colors.blue[900]};
        }
      `
    case 'secondary':
      return css`
        /* 1px inset border */
        box-shadow: inset 0 0 0 1px ${colors.gray[500]};

        &:hover {
          box-shadow: inset 0 0 0 1px ${colors.gray[50]};
        }

        &:active {
          box-shadow: inset 0 0 0 1px ${colors.gray[50]};
          background-color: ${colors.blue[500]};
        }
      `
    case 'tertiary':
      return css`
        &:hover {
          background-color: ${colors.transparentPrimary[12]};
        }

        &:active {
          background-color: ${colors.transparentPrimary[6]};
        }
      `
  }
}

const sizeStyles = ({ size }: ButtonBaseStyleProps): SerializedStyles => {
  switch (size) {
    case 'large':
      return css`
        padding: ${sizes(4)};
      `
    case 'medium':
      return css`
        padding: ${sizes(3)};
      `
    case 'small':
      return css`
        padding: ${sizes(2)};
      `
  }
}

export const StyledButtonBase = styled('button', { shouldForwardProp: isPropValid })<ButtonBaseStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 0;
  background-color: transparent;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }

  transition-duration: ${transitions.timings.sharp};
  transition-timing-function: ${transitions.easing};
  transition-property: background-color, box-shadow;

  ${variantStyles};
  ${sizeStyles};
`
