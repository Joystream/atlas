import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/theme'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'destructive-secondary'
  | 'warning'
  | 'warning-secondary'
export type ButtonSize = 'large' | 'medium' | 'small'
export type ButtonBaseStyleProps = {
  variant: ButtonVariant
  size: ButtonSize
  fullWidth?: boolean
  textOnly: boolean
  iconOnly: boolean
}

const variantStyles = ({ variant, textOnly, iconOnly }: ButtonBaseStyleProps): SerializedStyles => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${colors.blue[500]};
        color: ${textOnly ? colors.blue[300] : colors.gray[50]};

        path {
          fill: ${textOnly && colors.blue[300]};
        }

        &:hover,
        &:focus {
          background-color: ${colors.blue[700]};
        }

        &:active {
          background-color: ${colors.blue[900]};
          color: ${textOnly && colors.blue[400]};

          path {
            fill: ${textOnly && colors.blue[400]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${colors.gray[600]}`};
        }
      `
    case 'secondary':
      return css`
        /* 1px inset border */
        box-shadow: inset 0 0 0 1px ${colors.gray[400]};
        color: ${colors.gray[50]};

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${colors.gray[300]};
          border-color: ${colors.gray[300]};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${colors.gray[50]};
          color: ${textOnly && colors.gray[300]};

          path {
            fill: ${textOnly && colors.gray[300]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
    case 'tertiary':
      return css`
        color: ${colors.gray[50]};
        ${iconOnly && `border-radius: 50%`};

        &:hover,
        &:focus {
          background-color: ${colors.transparentPrimary[18]};
        }

        &:active {
          background-color: ${colors.transparentPrimary[10]};
        }
      `
    case 'destructive':
      return css`
        background-color: ${colors.secondary.alert[100]};
        color: ${colors.gray[50]};

        &:hover,
        &:focus {
          background-color: ${colors.secondary.alert[200]};
        }

        &:active {
          background-color: ${colors.secondary.alert[300]};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${colors.gray[600]}`};
        }
      `
    case 'destructive-secondary':
      return css`
        box-shadow: inset 0 0 0 1px ${colors.gray[400]};
        color: ${colors.secondary.alert[50]};

        path {
          fill: ${colors.secondary.alert[50]};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${colors.gray[300]};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${colors.gray[50]};
          color: ${textOnly && colors.secondary.alert[100]};

          path {
            fill: ${textOnly && colors.secondary.alert[100]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
    case 'warning':
      return css`
        background-color: ${colors.secondary.warning[100]};
        color: ${colors.gray[900]};

        path {
          fill: ${colors.gray[900]};
        }

        &:hover,
        &:focus {
          background-color: ${colors.secondary.warning[200]};
        }

        &:active {
          background-color: ${colors.secondary.warning[300]};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${colors.gray[600]}`};
        }
      `
    case 'warning-secondary':
      return css`
        color: ${colors.secondary.warning[100]};
        box-shadow: inset 0 0 0 1px ${colors.gray[400]};

        path {
          fill: ${colors.secondary.warning[100]};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${colors.gray[300]};
        }

        &:active {
          color: ${textOnly && colors.secondary.warning[300]};
          box-shadow: inset 0 0 0 2px ${colors.gray[50]};

          path {
            fill: ${textOnly && colors.secondary.warning[300]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
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

const textOnlyStyles = ({ textOnly }: ButtonBaseStyleProps): SerializedStyles | null =>
  textOnly
    ? css`
        background-color: ${colors.transparent};
        box-shadow: none;
        padding: 0;

        &:hover,
        &:focus {
          background-color: ${colors.transparent};
          box-shadow: none;
        }

        &:active {
          background-color: ${colors.transparent};
          box-shadow: none;
        }
      `
    : null

export const BorderWrapper = styled.div<Pick<ButtonBaseStyleProps, 'textOnly'>>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin-top: ${({ textOnly }) => textOnly && '-0.5px'};
  margin-bottom: ${({ textOnly }) => textOnly && '-0.5px'};
  height: 100%;
  visibility: hidden;
  border-bottom-width: ${({ textOnly }) => textOnly && '1px'};
  border-bottom-style: ${({ textOnly }) => textOnly && 'solid'};

  &:hover {
    visibility: visible;
  }

  * {
    visibility: visible;
  }
`

export const StyledButtonBase = styled('button', { shouldForwardProp: isPropValid })<ButtonBaseStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
    color: ${colors.gray[50]};
  }

  transition-duration: ${transitions.timings.sharp};
  transition-timing-function: ${transitions.easing};
  transition-property: background-color, box-shadow;

  ${variantStyles};
  ${sizeStyles};
  ${textOnlyStyles};

  :focus ${BorderWrapper} {
    visibility: visible;
  }
`
