import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ElementType, FC } from 'react'

import {
  SvgJoyTokenMonochrome16,
  SvgJoyTokenMonochrome24,
  SvgJoyTokenMonochrome32,
  SvgJoyTokenMonochrome48,
  SvgJoyTokenPrimary16,
  SvgJoyTokenPrimary24,
  SvgJoyTokenPrimary32,
  SvgJoyTokenPrimary48,
  SvgJoyTokenSilver16,
  SvgJoyTokenSilver24,
  SvgJoyTokenSilver32,
  SvgJoyTokenSilver48,
} from '@/components/_icons'
import { cVar } from '@/styles'

type JoyTokenIconVariant = 'primary' | 'silver' | 'regular' | 'gray'
type JoyTokenIconSize = 16 | 24 | 32 | 48

export type JoyTokenIconProps = {
  variant?: JoyTokenIconVariant
  size?: JoyTokenIconSize
  className?: string
}

const VARIANT_SIZE_COMPONENT_MAPPING: Record<JoyTokenIconVariant, Record<JoyTokenIconSize, ElementType>> = {
  primary: {
    16: SvgJoyTokenPrimary16,
    24: SvgJoyTokenPrimary24,
    32: SvgJoyTokenPrimary32,
    48: SvgJoyTokenPrimary48,
  },
  silver: {
    16: SvgJoyTokenSilver16,
    24: SvgJoyTokenSilver24,
    32: SvgJoyTokenSilver32,
    48: SvgJoyTokenSilver48,
  },
  regular: {
    16: SvgJoyTokenMonochrome16,
    24: SvgJoyTokenMonochrome24,
    32: SvgJoyTokenMonochrome32,
    48: SvgJoyTokenMonochrome48,
  },
  gray: {
    16: SvgJoyTokenMonochrome16,
    24: SvgJoyTokenMonochrome24,
    32: SvgJoyTokenMonochrome32,
    48: SvgJoyTokenMonochrome48,
  },
}

export const JoyTokenIcon: FC<JoyTokenIconProps> = ({ variant = 'regular', size = 16, className }) => (
  <JoyTokenIconWrapper
    as={VARIANT_SIZE_COMPONENT_MAPPING[variant][size]}
    hasShadow={!['regular', 'gray'].includes(variant)}
    className={className}
    variant={variant}
  />
)

const shadowCss = css`
  filter: drop-shadow(0 6px 11px rgba(0 0 0 / 0.65)) drop-shadow(0 1.809px 3.316px rgba(0 0 0 / 0.4235))
    drop-shadow(0 0.7513px 1.377px rgba(0 0 0 / 0.325)) drop-shadow(0 0.2717px 0.4982px rgba(0 0 0 / 0.2265));
`

const fillCss = ({ variant }: { variant: JoyTokenIconVariant }) => {
  if (variant === 'gray') {
    return css`
      path {
        fill: ${cVar('colorText')};
      }
    `
  }
  return css``
}

const JoyTokenIconWrapper = styled('div', { shouldForwardProp: isPropValid })<{
  hasShadow: boolean
  variant: JoyTokenIconVariant
}>`
  ${fillCss};

  ${({ hasShadow }) => hasShadow && shadowCss};
`
