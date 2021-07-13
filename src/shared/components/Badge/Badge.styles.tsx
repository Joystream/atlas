import { css } from '@emotion/react'

import { colors, sizes, typography } from '@/shared/theme'

export const badgeStyles = css`
  &[data-badge]::after {
    position: absolute;
    width: ${sizes(4)};
    height: ${sizes(4)};
    background: ${colors.blue[500]};
    border-radius: 100%;
    color: #fff;
    content: attr(data-badge);
    font-size: ${typography.sizes.caption};
    font-weight: ${typography.weights.regular};
    font-family: ${typography.fonts.base};
    padding-top: 1px;
    text-align: center;
  }

  &[data-badge^='-']::after,
  &[data-badge='0']::after,
  &[data-badge='']::after {
    display: none;
  }
`
