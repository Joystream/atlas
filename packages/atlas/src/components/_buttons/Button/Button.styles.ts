import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, oldColors, sizes, square } from '@/styles'

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

const badgeDotStyles = css`
  &::after {
    ${square(8)}

    content: '';
    background-color: ${oldColors.white};
    border-radius: 50%;
    display: block;
  }
`

export const Badge = styled.div<{ dot?: boolean }>`
  ${square(16)}

  font: ${cVar('typographyDesktopT100Strong')};
  letter-spacing: ${cVar('typographyDesktopT100StrongLetterSpacing')};
  text-transform: ${cVar('typographyDesktopT100StrongTextTransform')};
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${oldColors.blue[500]};
  position: absolute;
  border-radius: 50%;
  top: -${sizes(2)};
  right: -${sizes(2)};
  ${({ dot }) => dot && badgeDotStyles}
`
