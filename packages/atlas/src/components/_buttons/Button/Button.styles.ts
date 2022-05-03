import isPropValid from '@emotion/is-prop-valid'
import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { cVar, oldColors, sizes } from '@/styles'

const ButtonSizeObj = { large: 'large', medium: 'medium', small: 'small' }
export type ButtonSize = keyof typeof ButtonSizeObj
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

const variantStyles = ({
  variant,
  'data-text-only': textOnly,
  'data-icon-only': iconOnly,
}: ButtonBaseStyleProps): SerializedStyles => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${cVar('colorCoreBlue500')};
        color: ${textOnly ? cVar('colorCoreBlue300') : cVar('colorTextStrong')};

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
          background-color: ${oldColors.transparentPrimary[18]};
        }

        &:active {
          background-color: ${oldColors.transparentPrimary[10]};
        }
      `
    case 'destructive':
      return css`
        background-color: ${oldColors.secondary.alert[100]};
        color: ${cVar('colorCoreNeutral50')};

        &:hover,
        &:focus {
          background-color: ${oldColors.secondary.alert[200]};
        }

        &:active {
          background-color: ${oldColors.secondary.alert[300]};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${oldColors.gray[600]}`};
        }
      `
    case 'destructive-secondary':
      return css`
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
        color: ${oldColors.secondary.alert[50]};

        path {
          fill: ${oldColors.secondary.alert[50]};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral300')};
        }

        &:active {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral50')};
          color: ${textOnly && oldColors.secondary.alert[100]};

          path {
            fill: ${textOnly && oldColors.secondary.alert[100]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
    case 'warning':
      return css`
        background-color: ${oldColors.secondary.warning[100]};
        color: ${oldColors.gray[900]};

        path {
          fill: ${oldColors.gray[900]};
        }

        &:hover,
        &:focus {
          background-color: ${oldColors.secondary.warning[200]};
        }

        &:active {
          background-color: ${oldColors.secondary.warning[300]};
        }

        &:disabled,
        &[aria-disabled='true'] {
          ${!textOnly && `background-color: ${oldColors.gray[600]}`};
        }
      `
    case 'warning-secondary':
      return css`
        color: ${oldColors.secondary.warning[100]};
        box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};

        path {
          fill: ${oldColors.secondary.warning[100]};
        }

        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral300')};
        }

        &:active {
          color: ${textOnly && oldColors.secondary.warning[300]};
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral50')};

          path {
            fill: ${textOnly && oldColors.secondary.warning[300]};
          }
        }

        &:disabled,
        &[aria-disabled='true'] {
          opacity: ${iconOnly ? 0.25 : 0.5};
        }
      `
  }
}

const textOnlyStyles = ({ 'data-text-only': textOnly }: ButtonBaseStyleProps): SerializedStyles | null =>
  textOnly
    ? css`
        background-color: ${oldColors.transparent};
        box-shadow: none;
        padding: 0;

        &:hover,
        &:focus {
          background-color: ${oldColors.transparent};
          box-shadow: none;
        }

        &:active {
          background-color: ${oldColors.transparent};
          box-shadow: none;
        }
      `
    : null

export const BorderWrapper = styled.div<Pick<ButtonBaseStyleProps, 'data-text-only'>>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  visibility: hidden;

  &[data-text-only='true'] {
    margin-top: -0.5px;
    margin-bottom: -0.5px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }

  &:hover {
    visibility: visible;
  }

  * {
    visibility: visible;
  }
`

export type ButtonBaseStyleProps = {
  variant: ButtonVariant
  fullWidth?: boolean
  'data-size': ButtonSize
  'data-text-only': boolean
  'data-icon-only': boolean
  'data-badge'?: string | number | boolean
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
  transition-property: background-color, box-shadow;

  ${variantStyles};
  ${textOnlyStyles};
  ${smallBadgeStyles};

  &[data-badge]::after {
    position: absolute;
    right: -6px;
    top: -6px;
  }

  /* paddings */
  &[data-size=${ButtonSizeObj.small}] {
    padding: ${sizes(2)} ${sizes(3)};
  }
  &[data-size=${ButtonSizeObj.medium}] {
    padding: ${sizes(2.5)} ${sizes(4)};
  }
  &[data-size=${ButtonSizeObj.large}] {
    padding: ${sizes(3)} ${sizes(5)};
  }

  &[data-icon-only='true'] {
    &[data-size=${ButtonSizeObj.small}] {
      padding: ${sizes(2)};
    }
    &[data-size=${ButtonSizeObj.medium}] {
      padding: ${sizes(2.5)};
    }
    &[data-size=${ButtonSizeObj.large}] {
      padding: ${sizes(3)};
    }
  }

  &[data-text-only='true'] {
    padding-left: 0;
    padding-right: 0;
  }

  &:disabled,
  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
    color: ${cVar('colorCoreNeutral50')};
  }

  &:focus ${BorderWrapper} {
    visibility: visible;
  }
`
