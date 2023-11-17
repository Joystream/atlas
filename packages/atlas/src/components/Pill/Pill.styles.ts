import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar } from '@/styles'
import { sizes } from '@/styles/sizes'

import { PillProps, Sizes } from './types'

const sizeStyles = ({ size = 'medium', hasLabel, iconPlacement }: PillProps & { hasLabel: boolean }) => {
  const leftMarignActive = hasLabel && iconPlacement === 'right'
  const rightMarginActive = hasLabel && iconPlacement === 'left'
  switch (size) {
    case 'large':
      return css`
        padding: ${sizes(2)};

        svg {
          max-width: 16px;
          max-height: 16px;
          margin-right: ${rightMarginActive ? sizes(1.5) : 0};
          margin-left: ${leftMarignActive ? sizes(1.5) : 0};
        }
      `
    case 'medium':
      return css`
        padding: ${hasLabel ? `${sizes(1)} ${sizes(1.5)}` : sizes(1)};

        svg {
          max-width: 16px;
          max-height: 16px;
          margin-right: ${rightMarginActive ? sizes(1) : 0};
          margin-left: ${leftMarignActive ? sizes(1) : 0};
        }
      `
    default:
      return css`
        padding: ${hasLabel ? `${sizes(0.5)} ${sizes(1)}` : sizes(1)};

        svg {
          max-width: 12px;
          max-height: 12px;
          margin-right: ${rightMarginActive ? sizes(0.5) : 0};
          margin-left: ${leftMarignActive ? sizes(0.5) : 0};
        }
      `
  }
}

const variantStyles = ({ variant }: PillProps) => {
  switch (variant) {
    case 'overlay':
      return css`
        background-color: ${cVar('colorBackgroundOverlay')}; ;
      `
    case 'danger':
      return css`
        background-color: ${cVar('colorBackgroundError')};
      `
    default:
      return css`
        background-color: ${cVar('colorBackgroundStrong')};
      `
  }
}

export const StyledPill = styled.div<PillProps & { hasLabel: boolean }>`
  display: inline-flex;
  align-items: center;
  border-radius: ${(props) => (props.round ? '50%' : cVar('radiusSmall'))};

  svg {
    > * {
      fill: ${cVar('colorCoreNeutral50')};
    }
  }

  ${sizeStyles}
  ${variantStyles}
`

const gapStyles = ({ size }: PillProps) => {
  switch (size) {
    case 'large':
      return css`
        gap: ${sizes(2)};
      `
    case 'medium':
      return css`
        gap: ${sizes(1.5)};
      `
    case 'small':
      return css`
        gap: ${sizes(1)};
      `
  }
}

export const PillGroupWrapper = styled.div<{ size: Sizes }>`
  display: inline-grid;
  grid-auto-flow: column;

  ${gapStyles}
`

export const StyledLabel = styled(Text)`
  font-feature-settings: 'tnum' on, 'lnum' on;
`
