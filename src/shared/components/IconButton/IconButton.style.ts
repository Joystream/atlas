import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ButtonBase, ButtonVariant } from '../ButtonBase'

type ButtonVariantProps = {
  variant: ButtonVariant
}

const tertiaryOverwriteStyles = css`
  border-radius: 100%;
`

export const StyledButtonBase = styled(ButtonBase)<ButtonVariantProps>`
  ${({ variant }) => variant === 'tertiary' && tertiaryOverwriteStyles};
`
