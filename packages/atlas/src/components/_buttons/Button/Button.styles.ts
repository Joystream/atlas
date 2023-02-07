import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { cVar, sizes } from '@/styles'

export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'destructive-secondary'
  | 'warning'
  | 'warning-secondary'

const getIconOnlyPadding = (size?: ButtonSize, iconOnly?: boolean) => {
  if (!iconOnly) return null
  switch (size) {
    case 'large':
      return css`
        padding: ${sizes(1)};
      `
    case 'medium':
      return css`
        padding: ${sizes(0.5)};
      `
    case 'small':
      return css``
    default:
      return css`
        padding: ${sizes(0.5)};
      `
  }
}
export type IconPlacement = 'left' | 'right'
type ButtonIconWrapperProps = {
  iconPlacement: IconPlacement
  iconOnly?: boolean
}
export const ButtonIconWrapper = styled.span<ButtonIconWrapperProps & { size?: ButtonSize }>`
  ${({ size, iconOnly }) => getIconOnlyPadding(size, iconOnly)};

  margin-right: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'left' && !iconOnly ? sizes(2) : 0)};
  margin-left: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'right' && !iconOnly ? sizes(2) : 0)};
`

const buttonVariantStyles = ({ variant, iconOnly }: ButtonBaseStyleProps): SerializedStyles => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${cVar('colorCoreBlue500')};
        color: ${cVar('colorTextStrong')};
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral800Lighten')};

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreBlue400')};
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:active {
          background-color: ${cVar('colorCoreBlue600')};
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorCoreNeutral800')};
          box-shadow: none;
        }
      `
    case 'secondary':
      return css`
        /* 1px inset border */
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral800Lighten')};
        background-color: ${cVar('colorCoreNeutral900Lighten')};
        color: ${cVar('colorTextStrong')};

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
          background-color: ${cVar('colorCoreNeutral800Lighten')};
        }

        &:active {
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
          box-shadow: none;
        }
      `
    case 'tertiary':
      return css`
        color: ${cVar('colorCoreNeutral50')};
        border-radius: ${iconOnly && '50%'};

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreNeutral800Lighten')};
        }

        &:active {
          background-color: ${cVar('colorCoreNeutral900Lighten')};
        }
      `
    case 'destructive':
      return css`
        background-color: ${cVar('colorCoreRed500')};
        color: ${cVar('colorTextStrong')};

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreRed400')};
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:active {
          background-color: ${cVar('colorCoreRed600')};
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorCoreNeutral600')};
        }
      `
    case 'destructive-secondary':
      return css`
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral800Lighten')};
        color: ${cVar('colorTextError')};
        background-color: ${cVar('colorCoreNeutral900Lighten')};

        path {
          fill: ${cVar('colorCoreRed200')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral600Lighten')};
          background-color: ${cVar('colorCoreNeutral800Lighten')};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral600Lighten')};
          background-color: ${cVar('colorCoreNeutral900Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
          box-shadow: none;
          color: ${cVar('colorTextError')}!important;
        }
      `
    case 'warning':
      return css`
        background-color: ${cVar('colorCoreYellow200')};
        color: ${cVar('colorCoreNeutral900')};
        box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral800Lighten')};

        path {
          fill: ${cVar('colorCoreNeutral900')};
        }

        &:hover,
        &:focus {
          background-color: ${cVar('colorCoreYellow100')};
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:active {
          background-color: ${cVar('colorCoreYellow300')};
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral600Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorCoreNeutral600')};
          box-shadow: none;
        }
      `
    case 'warning-secondary':
      return css`
        color: ${cVar('colorTextCaution')};
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral800Lighten')};
        background-color: ${cVar('colorCoreNeutral900Lighten')};

        path {
          fill: ${cVar('colorCoreYellow200')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
          background-color: ${cVar('colorCoreNeutral800Lighten')};
        }

        &:active {
          box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral600Lighten')};
          background-color: ${cVar('colorCoreNeutral900Lighten')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
          box-shadow: none;
          color: ${cVar('colorTextCaution')}!important;
        }
      `
  }
}

export const BorderWrapper = styled.div<Pick<ButtonBaseStyleProps, 'textOnly'>>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  visibility: hidden;
  margin-top: ${({ textOnly }) => textOnly && '-0.5px'};
  margin-bottom: ${({ textOnly }) => textOnly && '-0.5px'};
  border-bottom-width: ${({ textOnly }) => textOnly && '1px'};
  border-bottom-style: ${({ textOnly }) => textOnly && 'solid'};

  &:hover {
    visibility: visible;
  }

  * {
    visibility: visible;
  }
`

const buttonSizeStyles = ({ size, iconOnly, textOnly }: ButtonBaseStyleProps) => {
  if (iconOnly) {
    switch (size) {
      case 'large':
        return css`
          padding: ${sizes(4)};
        `
      case 'medium':
        return css`
          padding: ${sizes(3.25)};
        `
      case 'small':
        return css`
          padding: ${sizes(2.25)};
        `
    }
  } else if (textOnly) {
    return css`
      padding: 0;
    `
  } else {
    switch (size) {
      case 'large':
        return css`
          padding: ${sizes(3)} ${sizes(5)};
        `
      case 'medium':
        return css`
          padding: ${sizes(2.5)} ${sizes(4)};
        `
      case 'small':
        return css`
          padding: ${sizes(2)} ${sizes(3)};
        `
    }
  }
}

const textOnlyStyles = ({ textOnly, variant }: ButtonBaseStyleProps) => {
  if (!textOnly) return

  let variantCss
  switch (variant) {
    case 'primary':
      variantCss = css`
        color: ${cVar('colorCoreBlue300')};

        path {
          fill: ${cVar('colorCoreBlue300')};
        }

        &:active {
          color: ${cVar('colorCoreBlue400')};

          path {
            fill: ${cVar('colorCoreBlue400')};
          }
        }
      `
      break
    case 'secondary':
      variantCss = css`
        color: ${cVar('colorCoreNeutral50')};

        &:active {
          color: ${cVar('colorCoreNeutral300')};

          path {
            fill: ${cVar('colorCoreNeutral300')};
          }
        }
      `
      break
    case 'tertiary':
      variantCss = css`
        color: ${cVar('colorCoreNeutral300')};

        path {
          fill: ${cVar('colorCoreNeutral300')};
        }

        &:hover,
        &:focus,
        &:active {
          ${BorderWrapper} {
            visibility: hidden;
          }

          color: ${cVar('colorCoreNeutral50')};

          path {
            fill: ${cVar('colorCoreNeutral50')};
          }
        }

        ${BorderWrapper} {
          visibility: hidden;
        }
      `
      break
    case 'destructive':
      variantCss = css`
        color: ${cVar('colorCoreRed200')};

        path {
          fill: ${cVar('colorCoreRed200')};
        }

        &:active {
          color: ${cVar('colorCoreRed400')};

          path {
            fill: ${cVar('colorCoreRed400')};
          }
        }
      `
      break
    case 'warning':
      variantCss = css`
        color: ${cVar('colorCoreYellow200')};

        path {
          fill: ${cVar('colorCoreYellow200')};
        }

        &:active {
          color: ${cVar('colorCoreYellow400')};

          path {
            fill: ${cVar('colorCoreYellow400')};
          }
        }
      `
      break
  }

  return [
    css`
      background-color: transparent;
      box-shadow: none;

      &:hover,
      &:focus {
        background-color: transparent;
        box-shadow: none;
      }

      &:active {
        background-color: transparent;
        box-shadow: none;
      }

      &:disabled,
      &[aria-disabled='true'] {
        background-color: transparent;
      }
    `,
    variantCss,
  ]
}

export type ButtonBaseStyleProps = {
  variant: ButtonVariant
  fullWidth?: boolean
  size: ButtonSize
  textOnly: boolean
  iconOnly: boolean
  'data-badge'?: string | number | boolean
  rounded: boolean
}
export const ButtonBase = styled('button', { shouldForwardProp: isPropValid })<ButtonBaseStyleProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  transition-duration: ${cVar('animationTimingFast')};
  transition-timing-function: ${cVar('animationTimingFast')};
  transition-property: background-color, box-shadow, color, fill;
  border-radius: ${({ rounded }) => (rounded ? '999px' : cVar('radiusSmall'))};

  &:focus ${BorderWrapper} {
    visibility: visible;
  }

  ${buttonVariantStyles};
  ${buttonSizeStyles};
  ${textOnlyStyles};
  ${smallBadgeStyles};

  path {
    transition: fill ${cVar('animationTransitionFast')};
  }

  &[data-badge]::after {
    position: absolute;
    right: -6px;
    top: -6px;
  }

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
    color: ${({ textOnly }) => !textOnly && cVar('colorCoreNeutral50')};
  }
`
