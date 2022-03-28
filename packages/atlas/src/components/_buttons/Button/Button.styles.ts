import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { Text } from '@/components/Text'
import { sizes } from '@/styles'

import { ButtonBase, ButtonSize, ButtonVariant } from '../ButtonBase'

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
}: Pick<TextProps, 'size' | 'textOnly' | 'iconOnly'>): SerializedStyles | null => {
  if (textOnly)
    return css`
      padding-left: 0;
      padding-right: 0;
    `
  if (iconOnly) {
    return null
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

export const StyledButtonBase = styled(ButtonBase)<ButtonSizeProps>`
  ${sizeOverwriteStyles};
  ${smallBadgeStyles};

  &[data-badge]::after {
    position: absolute;
    right: -6px;
    top: -6px;
  }

  position: relative;
`

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

export const ButtonIconWrapper = styled.span<ButtonIconWrapperProps & { size?: ButtonSize }>`
  ${({ size, iconOnly }) => getIconOnlyPadding(size, iconOnly)};

  margin-right: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'left' && !iconOnly ? sizes(2) : 0)};
  margin-left: ${({ iconPlacement, iconOnly }) => (iconPlacement === 'right' && !iconOnly ? sizes(2) : 0)};
`

export const StyledText = styled(Text)<TextProps>`
  color: inherit;
`
