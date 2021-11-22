import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { oldColors, oldTypography, sizes } from '@/styles'

export const smallBadgeStyles = css`
  &[data-badge]::after {
    position: absolute;
    width: ${sizes(4)};
    height: ${sizes(4)};
    background: ${oldColors.blue[500]};
    border-radius: 100%;
    color: #fff;
    content: attr(data-badge);
    font-size: ${oldTypography.sizes.caption};
    font-weight: ${oldTypography.weights.regular};
    font-family: ${oldTypography.fonts.base};
    padding-top: 1px;
    text-align: center;
  }

  &[data-badge^='-']::after,
  &[data-badge='0']::after,
  &[data-badge='']::after {
    display: none;
  }
`

export const Badge = styled(Text)`
  margin-left: ${sizes(3)};
  background-color: ${oldColors.gray[700]};
  padding: 2px ${sizes(1)};
`
