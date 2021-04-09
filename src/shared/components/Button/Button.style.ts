import styled from '@emotion/styled'
import ButtonBase, { ButtonSize } from '../ButtonBase'
import Icon from '../Icon'
import Text from '../Text'
import { css, SerializedStyles } from '@emotion/react'
import { sizes } from '@/shared/theme'

type ButtonSizeProps = {
  size: ButtonSize
}

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

const textPaddingStyles = ({ size }: ButtonSizeProps): SerializedStyles | null => {
  if (size === 'medium') {
    return css`
      padding: 1px 0;
    `
  }
  if (size === 'small') {
    return css`
      padding: 2px 0;
    `
  }
  return null
}

export const StyledButtonBase = styled(ButtonBase)<ButtonSizeProps>`
  ${sizeOverwriteStyles};
`

export const StyledText = styled(Text)<ButtonSizeProps>`
  // compensate for line-height being 1
  ${textPaddingStyles};
`

export const StyledIcon = styled(Icon)`
  margin-right: ${sizes(2)};
`
