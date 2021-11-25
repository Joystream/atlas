import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { oldColors, oldTypography } from '@/styles'

type TextProps = {
  isSecondary?: boolean
}

const baseStyles = (props: TextProps) => css`
  font-family: ${oldTypography.fonts.base};
  margin: 0;
  color: ${props.isSecondary ? oldColors.gray[300] : oldColors.gray[50]};
`

export const styledVariants = {
  hero: styled.h1<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.hero};
    line-height: ${oldTypography.lineHeights.hero};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h1: styled.h1<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h1};
    line-height: ${oldTypography.lineHeights.h1};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h2: styled.h2<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h2};
    line-height: ${oldTypography.lineHeights.h2};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h3: styled.h3<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h3};
    line-height: ${oldTypography.lineHeights.h3};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h4: styled.h4<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h4};
    line-height: ${oldTypography.lineHeights.h4};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h5: styled.h5<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h5};
    line-height: ${oldTypography.lineHeights.h5};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  h6: styled.h6<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.h6};
    line-height: ${oldTypography.lineHeights.h6};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  subtitle1: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.subtitle1};
    line-height: ${oldTypography.lineHeights.subtitle1};
    font-weight: ${oldTypography.weights.regular};
  `,
  subtitle2: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.subtitle2};
    line-height: ${oldTypography.lineHeights.subtitle2};
    font-weight: ${oldTypography.weights.regular};
  `,
  body1: styled.p<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.body1};
    line-height: ${oldTypography.lineHeights.body1};
    font-weight: ${oldTypography.weights.regular};
  `,
  body2: styled.p<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.body2};
    line-height: ${oldTypography.lineHeights.body2};
    font-weight: ${oldTypography.weights.regular};
  `,
  caption: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.caption};
    line-height: ${oldTypography.lineHeights.caption};
    font-weight: ${oldTypography.weights.regular};
  `,
  overhead: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.overhead};
    line-height: ${oldTypography.lineHeights.overhead};
    font-weight: ${oldTypography.weights.semibold};
  `,
  button1: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.button.large};
    line-height: ${oldTypography.lineHeights.button};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  button2: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.button.medium};
    line-height: ${oldTypography.lineHeights.button};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
  button3: styled.span<TextProps>`
    ${baseStyles};

    font-size: ${oldTypography.sizes.button.small};
    line-height: ${oldTypography.lineHeights.button};
    font-weight: ${oldTypography.weights.bold};
    font-family: ${oldTypography.fonts.headers};
  `,
}
