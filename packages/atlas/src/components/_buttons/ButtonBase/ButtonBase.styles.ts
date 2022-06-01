import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes, transitions } from '@/styles'

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
        background-color: ${cVar('colorCoreBlue500')};
        color: ${textOnly ? cVar('colorCoreBlue300') : cVar('colorCoreNeutral50')};

        path {
          fill: ${textOnly && cVar('colorCoreBlue300')};
        }

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreBlue700')};
        }

        &:active {
          background-color: ${cVar('colorCoreBlue900')};
          color: ${textOnly && cVar('colorCoreBlue400')};

          path {
            fill: ${textOnly && cVar('colorCoreBlue400')};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${cVar('colorCoreNeutral600')}`};
        }
      `
    case 'secondary':
      return css`
        /* 1px inset border */
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
        color: ${cVar('colorCoreNeutral50')};

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral300')};
          border-color: ${cVar('colorCoreNeutral300')};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral50')};
          color: ${textOnly && cVar('colorCoreNeutral300')};

          path {
            fill: ${textOnly && cVar('colorCoreNeutral300')};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
    case 'tertiary':
      return css`
        color: ${cVar('colorCoreNeutral50')};
        ${iconOnly && `border-radius: 50%`};

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreNeutral700Lighten')};
        }

        &:active {
          background-color: ${cVar('colorCoreNeutral800Lighten')};
        }
      `
    case 'destructive':
      return css`
        background-color: ${cVar('colorCoreRed400')};
        color: ${cVar('colorCoreNeutral50')};

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreRed600')};
        }

        &:active {
          background-color: ${cVar('colorCoreRed700')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${cVar('colorCoreNeutral600')}`};
        }
      `
    case 'destructive-secondary':
      return css`
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
        color: ${cVar('colorCoreRed200')};

        path {
          fill: ${cVar('colorCoreRed200')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral300')};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral50')};
          color: ${textOnly && cVar('colorCoreRed400')};

          path {
            fill: ${textOnly && cVar('colorCoreRed400')};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
    case 'warning':
      return css`
        background-color: ${cVar('colorCoreYellow200')};
        color: ${cVar('colorCoreNeutral900')};

        path {
          fill: ${cVar('colorCoreNeutral900')};
        }

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreYellow300')};
        }

        &:active {
          background-color: ${cVar('colorCoreYellow400')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${cVar('colorCoreNeutral600')}`};
        }
      `
    case 'warning-secondary':
      return css`
        color: ${cVar('colorCoreYellow200')};
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};

        path {
          fill: ${cVar('colorCoreYellow200')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral300')};
        }

        &:active {
          color: ${textOnly && cVar('colorCoreYellow400')};
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral50')};

          path {
            fill: ${textOnly && cVar('colorCoreYellow400')};
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
        padding: ${sizes(3)};
      `
    case 'medium':
      return css`
        padding: ${sizes(2.5)};
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
        background-color: transparent;
        box-shadow: none;
        padding: 0;

        &:hover,
        &:focus {
          background-color: transparent;
          box-shadow: none;
        }

        &:active {
          background-color: transparent;
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
    color: ${cVar('colorCoreNeutral50')};
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
