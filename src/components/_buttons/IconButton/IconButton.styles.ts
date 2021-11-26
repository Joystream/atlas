import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

import { ButtonBase, ButtonSize, ButtonVariant } from '../ButtonBase'

type ButtonVariantProps = {
  variant: ButtonVariant
}

const tertiaryOverwriteStyles = css`
  border-radius: 100%;
`

const getIconOnlyPadding = (size?: ButtonSize) => {
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
    default:
      return css`
        padding: ${sizes(3)};
      `
  }
}

export const StyledButtonBase = styled(ButtonBase)<ButtonVariantProps & { size?: ButtonSize }>`
  ${({ variant }) => variant === 'tertiary' && tertiaryOverwriteStyles};
  ${({ size }) => getIconOnlyPadding(size)};
`
