import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'

type TextProps = {
  color?: string
  isSecondary?: boolean
}

const baseStyles = (props: TextProps) => css`
  margin: 0;
  color: ${props.color ? props.color : props.isSecondary ? cVar('colorCoreNeutral300') : cVar('colorCoreNeutral50')};
`

export const styledVariants = {
  h900: styled.h1<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH900')};
    letter-spacing: ${cVar('typographyDesktopH900LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH900TextTransform')};
  `,
  h800: styled.h1<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH800')};
    letter-spacing: ${cVar('typographyDesktopH800LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH800TextTransform')};
  `,
  h700: styled.h2<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
  `,
  h600: styled.h3<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH600')};
    letter-spacing: ${cVar('typographyDesktopH600LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH600TextTransform')};
  `,
  h500: styled.h4<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH500')};
    letter-spacing: ${cVar('typographyDesktopH500LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH500TextTransform')};
  `,
  h400: styled.h5<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH400')};
    letter-spacing: ${cVar('typographyDesktopH400LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH400TextTransform')};
  `,
  h300: styled.h6<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH300')};
    letter-spacing: ${cVar('typographyDesktopH300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH300TextTransform')};
  `,
  h200: styled.h6<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH200')};
    letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH200TextTransform')};
  `,
  h100: styled.h6<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH100')};
    letter-spacing: ${cVar('typographyDesktopH100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH100TextTransform')};
  `,
  t300: styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT300')};
    letter-spacing: ${cVar('typographyDesktopT300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT300TextTransform')};
  `,
  't300-strong': styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT300Strong')};
    letter-spacing: ${cVar('typographyDesktopT300StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT300StrongTextTransform')};
  `,
  t200: styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
  `,
  't200-strong': styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT200Strong')};
    letter-spacing: ${cVar('typographyDesktopT200StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200StrongTextTransform')};
  `,
  t100: styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT100')};
    letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100TextTransform')};
  `,
  't100-strong': styled.span<TextProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT100Strong')};
    letter-spacing: ${cVar('typographyDesktopT100StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100StrongTextTransform')};
  `,
}
