import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, typography } from '../../theme'

const baseStyles = css`
  font-family: ${typography.fonts.base};
  margin: 0;
  color: ${colors.gray[50]};
`

export const secondaryTextStyles = css`
  color: ${colors.gray[300]};
`

export const styledVariants = {
  hero: styled.h1`
    ${baseStyles}

    font-size: ${typography.sizes.hero};
    line-height: ${typography.lineHeights.hero};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h1: styled.h1`
    ${baseStyles}

    font-size: ${typography.sizes.h1};
    line-height: ${typography.lineHeights.h1};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h2: styled.h2`
    ${baseStyles}

    font-size: ${typography.sizes.h2};
    line-height: ${typography.lineHeights.h2};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h3: styled.h3`
    ${baseStyles}

    font-size: ${typography.sizes.h3};
    line-height: ${typography.lineHeights.h3};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h4: styled.h4`
    ${baseStyles}

    font-size: ${typography.sizes.h4};
    line-height: ${typography.lineHeights.h4};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h5: styled.h5`
    ${baseStyles}

    font-size: ${typography.sizes.h5};
    line-height: ${typography.lineHeights.h5};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h6: styled.h6`
    ${baseStyles}

    font-size: ${typography.sizes.h6};
    line-height: ${typography.lineHeights.h6};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  subtitle1: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.subtitle1};
    line-height: ${typography.lineHeights.subtitle1};
    font-weight: ${typography.weights.regular};
  `,
  subtitle2: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.subtitle2};
    line-height: ${typography.lineHeights.subtitle2};
    font-weight: ${typography.weights.regular};
  `,
  body1: styled.p`
    ${baseStyles}

    font-size: ${typography.sizes.body1};
    line-height: ${typography.lineHeights.body1};
    font-weight: ${typography.weights.regular};
  `,
  body2: styled.p`
    ${baseStyles}

    font-size: ${typography.sizes.body2};
    line-height: ${typography.lineHeights.body2};
    font-weight: ${typography.weights.regular};
  `,
  caption: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.caption};
    line-height: ${typography.lineHeights.caption};
    font-weight: ${typography.weights.regular};
  `,
  overhead: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.overhead};
    line-height: ${typography.lineHeights.overhead};
    font-weight: ${typography.weights.semibold};
  `,
  button1: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.button.large};
    line-height: ${typography.lineHeights.button};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  button2: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.button.medium};
    line-height: ${typography.lineHeights.button};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  button3: styled.span`
    ${baseStyles}

    font-size: ${typography.sizes.button.small};
    line-height: ${typography.lineHeights.button};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
}
