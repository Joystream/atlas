import { typography, colors } from '../../theme'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

const baseStyles = css`
  font-family: ${typography.fonts.base};
  margin: 0;
`

export const styledVariants = {
  hero: styled.h1`
    ${baseStyles};
    font-size: ${typography.sizes.hero};
    font-weight: ${typography.weights.bold};
    font-family: ${typography.fonts.headers};
  `,
  h1: styled.h1`
    ${baseStyles};
    font-size: ${typography.sizes.h1};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  h2: styled.h2`
    ${baseStyles};
    font-size: ${typography.sizes.h2};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  h3: styled.h3`
    ${baseStyles};
    font-size: ${typography.sizes.h3};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  h4: styled.h4`
    ${baseStyles};
    font-size: ${typography.sizes.h4};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  h5: styled.h5`
    ${baseStyles};
    font-size: ${typography.sizes.h5};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  h6: styled.h6`
    ${baseStyles};
    font-size: ${typography.sizes.h6};
    font-weight: ${typography.weights.medium};
    font-family: ${typography.fonts.headers};
  `,
  subtitle1: styled.span`
    ${baseStyles};
    font-size: ${typography.sizes.subtitle1};
    font-weight: ${typography.weights.light};
  `,
  subtitle2: styled.span`
    ${baseStyles};
    font-size: ${typography.sizes.subtitle2};
    font-weight: ${typography.weights.regular};
  `,
  overhead: styled.span`
    ${baseStyles};
    font-size: ${typography.sizes.overhead};
    font-weight: ${typography.weights.medium};
  `,
  body1: styled.p`
    ${baseStyles};
    font-size: ${typography.sizes.body1};
    font-weight: ${typography.weights.light};
  `,
  body2: styled.p`
    ${baseStyles};
    font-size: ${typography.sizes.body2};
    font-weight: ${typography.weights.light};
  `,
  caption: styled.caption`
    ${baseStyles};
    font-size: ${typography.sizes.caption};
    font-weight: ${typography.weights.light};
  `,
}
