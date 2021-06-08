import { css, SerializedStyles } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import ButtonBase, { ButtonSize } from '../ButtonBase'
import Text from '../Text'

type ButtonSizeProps = {
  size: ButtonSize
}

export type TextColorVariant = 'default' | 'error'
type TextProps = {
  textColorVariant?: TextColorVariant
} & ButtonSizeProps

const sizeOverwriteStyles = ({ size }: ButtonSizeProps): SerializedStyles => {
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
  ${sizeOverwriteStyles}
  ${sizeOverwriteStyles}
`

export const ButtonIconWrapper = styled.span`
  margin-right: ${sizes(2)};
`

export const StyledText = styled(Text)<TextProps>`
  /* compensate for line-height being 1 */
  ${textPaddingStyles}

  color: ${({ textColorVariant }) => textColorVariant === 'error' && colors.error}
`
