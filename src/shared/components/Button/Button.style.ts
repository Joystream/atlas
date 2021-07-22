import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/shared/theme'

import { ButtonBase, ButtonSize, ButtonVariant } from '../ButtonBase'
import { Text } from '../Text'

export type IconPlacement = 'left' | 'right'
type ButtonIconWrapperProps = {
  iconPlacement: IconPlacement
  iconOnly?: boolean
}

type ButtonSizeProps = {
  size: ButtonSize
}

type TextProps = {
  textColorVariant?: ButtonVariant
  textOnly?: boolean
  iconOnly?: boolean
} & ButtonSizeProps

const sizeOverwriteStyles = ({
  size,
  textOnly,
  iconOnly,
}: Pick<TextProps, 'size' | 'textOnly' | 'iconOnly'>): SerializedStyles => {
  if (textOnly)
    return css`
      padding-left: 0;
      padding-right: 0;
    `
  if (iconOnly) {
    /* stylelint-disable no-empty-source */
    return css``
  }
  switch (size) {
    case 'large':
      return css`
        padding-left: ${sizes(5)};
        padding-right: ${sizes(5)};
      `
    case 'medium':
      return css`
        padding-left: ${sizes(4)};
        padding-right: ${sizes(4)};
      `
    case 'small':
      return css`
        padding-left: ${sizes(3)};
        padding-right: ${sizes(3)};
      `
  }
}

const textPaddingStyles = ({ size }: ButtonSizeProps): SerializedStyles => {
  // make the text look centered wrt the icon
  switch (size) {
    case 'large':
      return css`
        margin-top: -2px;
        padding-bottom: 2px;
      `
    case 'medium':
      return css`
        padding-bottom: 2px;
      `
    case 'small':
      return css`
        padding: 1px 0 3px 0;
      `
  }
}

export const StyledButtonBase = styled(ButtonBase)<ButtonSizeProps>`
  ${sizeOverwriteStyles};
`

export const ButtonIconWrapper = styled.span<ButtonIconWrapperProps>`
  margin-right: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'left' && !iconOnly ? sizes(2) : 0)};
  margin-left: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'right' && !iconOnly ? sizes(2) : 0)};
`

export const StyledText = styled(Text)<TextProps>`
  /* compensate for line-height being 1 */
  ${textPaddingStyles}

  color: inherit;
`
