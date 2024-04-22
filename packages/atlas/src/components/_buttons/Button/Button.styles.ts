import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { Text } from '@/components/Text'
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
        background-color: ${cVar('colorBackgroundPrimary')};
        color: ${cVar('colorTextStrong')};
        box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};

        &:hover,
        &:focus {
          background-color: ${cVar('colorBackgroundPrimaryStrong')};
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
        }

        &:active {
          background-color: ${cVar('colorBackgroundPrimaryMuted')};
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorBackgroundAlpha')};
          box-shadow: none;
        }
      `
    case 'secondary':
      return css`
        /* 1px inset border */
        box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
        background-color: ${cVar('colorBackgroundMutedAlpha')};
        color: ${cVar('colorTextStrong')};

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
          background-color: ${cVar('colorBackgroundAlpha')};
        }

        &:active {
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
          box-shadow: none;
        }
      `
    case 'tertiary':
      return css`
        color: ${cVar('colorTextStrong')};
        border-radius: ${iconOnly && '50%'};

        &:hover,
        &:focus {
          background-color: ${cVar('colorBackgroundAlpha')};
        }

        &:active {
          background-color: ${cVar('colorBackgroundMutedAlpha')};
        }
      `
    case 'destructive':
      return css`
        background-color: ${cVar('colorBackgroundError')};
        color: ${cVar('colorTextStrong')};

        &:hover,
        &:focus {
          background-color: ${cVar('colorBackgroundErrorStrong')};
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
        }

        &:active {
          background-color: ${cVar('colorBackgroundErrorMuted')};
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorBackgroundAlpha')};
        }
      `
    case 'destructive-secondary':
      return css`
        box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
        color: ${cVar('colorTextError')};
        background-color: ${cVar('colorBackgroundMutedAlpha')};

        path {
          fill: ${cVar('colorTextError')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorBorderAlpha')};
          background-color: ${cVar('colorBackgroundAlpha')};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${cVar('colorBorderAlpha')};
          background-color: ${cVar('colorBackgroundMutedAlpha')};
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
        background-color: ${cVar('colorBackgroundCaution')};
        color: ${cVar('colorBackgroundMuted')};
        box-shadow: inset 0 0 0 2px ${cVar('colorBorderMutedAlpha')};

        path {
          fill: ${cVar('colorBackgroundMuted')};
        }

        &:hover,
        &:focus {
          background-color: ${cVar('colorBackgroundCautionStrong')};
          box-shadow: inset 0 0 0 2px ${cVar('colorBorderAlpha')};
        }

        &:active {
          background-color: ${cVar('colorBackgroundCautionMuted')};
          box-shadow: inset 0 0 0 2px ${cVar('colorBorderAlpha')};
        }

        &:disabled,
        &[aria-disabled='true'] {
          background-color: ${cVar('colorBackgroundAlpha')};
          box-shadow: none;
        }
      `
    case 'warning-secondary':
      return css`
        color: ${cVar('colorTextCaution')};
        box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
        background-color: ${cVar('colorBackgroundMutedAlpha')};

        path {
          fill: ${cVar('colorTextCaution')};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
          background-color: ${cVar('colorBackgroundAlpha')};
        }

        &:active {
          box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
          background-color: ${cVar('colorBackgroundMutedAlpha')};
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

export const BorderWrapper = styled.span<Pick<ButtonBaseStyleProps, 'textOnly'>>`
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
          max-height: 48px;
          max-width: 48px;
        `
      case 'medium':
        return css`
          padding: ${sizes(3.25)};
          max-height: 40px;
          max-width: 40px;
        `
      case 'small':
        return css`
          padding: ${sizes(2.25)};
          max-height: 32px;
          max-width: 32px;
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
        color: ${cVar('colorTextPrimary')};

        path {
          fill: ${cVar('colorTextPrimary')};
        }

        &:active {
          color: ${cVar('colorBackgroundPrimaryStrong')};

          path {
            fill: ${cVar('colorBackgroundPrimaryStrong')};
          }
        }
      `
      break
    case 'secondary':
      variantCss = css`
        color: ${cVar('colorTextStrong')};

        &:active {
          color: ${cVar('colorTextMuted')};

          path {
            fill: ${cVar('colorTextMuted')};
          }
        }
      `
      break
    case 'tertiary':
      variantCss = css`
        color: ${cVar('colorTextMuted')};

        path {
          fill: ${cVar('colorTextMuted')};
        }

        &:hover,
        &:focus,
        &:active {
          ${BorderWrapper} {
            visibility: hidden;
          }

          color: ${cVar('colorTextStrong')};

          path {
            fill: ${cVar('colorTextStrong')};
          }
        }

        ${BorderWrapper} {
          visibility: hidden;
        }
      `
      break
    case 'destructive':
      variantCss = css`
        color: ${cVar('colorTextError')};

        path {
          fill: ${cVar('colorTextError')};
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
        color: ${cVar('colorTextCaution')};

        path {
          fill: ${cVar('colorTextCaution')};
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

  span {
    white-space: nowrap;
  }

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
    color: ${({ textOnly }) => !textOnly && cVar('colorTextStrong')};
  }
`

export const ButtonText = styled(Text)`
  white-space: nowrap;
`
