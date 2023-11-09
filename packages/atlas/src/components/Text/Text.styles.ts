import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes, theme } from '@/styles'

type FilterStartingWith<Keys, Prefix extends string> = Keys extends `${Prefix}${infer _}` ? Keys : never
export type Color = FilterStartingWith<keyof typeof theme, 'color'> | 'inherit'
export type TextBaseProps = {
  color?: Color
  clampAfterLine?: number
  margin?: MarginProps
  align?: AlignProps
}

type MarginProps =
  | {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }
  | number

export type AlignProps = 'left' | 'center' | 'right' | 'justify' | 'end'

const alignStyles = ({ align }: TextBaseProps) =>
  !!align &&
  css`
    text-align: ${align};
  `

const marginStyles = ({ margin }: TextBaseProps) =>
  typeof margin !== 'number' && !!margin
    ? css`
        margin: ${sizes(margin.top ?? 0)} ${sizes(margin.right ?? 0)} ${sizes(margin.bottom ?? 0)}
          ${sizes(margin.left ?? 0)};
      `
    : css`
        margin: ${sizes(margin ?? 0)};
      `

const clampStyles = ({ clampAfterLine }: TextBaseProps) => css`
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-line-clamp: ${clampAfterLine};
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const baseStyles = ({ color = 'colorTextStrong', clampAfterLine, margin, align }: TextBaseProps) => css`
  color: ${color === 'inherit' ? color : cVar(color)};
  white-space: pre-wrap;

  ${clampAfterLine && clampStyles({ clampAfterLine })}
  ${marginStyles({ margin })}
  ${alignStyles({ align })}
`

export const styledVariants = {
  h1100: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH1100')};
    letter-spacing: ${cVar('typographyDesktopH1100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH1100TextTransform')};
  `,
  h1000: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH1000')};
    letter-spacing: ${cVar('typographyDesktopH1000LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH1000TextTransform')};
  `,
  h900: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH900')};
    letter-spacing: ${cVar('typographyDesktopH900LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH900TextTransform')};
  `,
  h800: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH800')};
    letter-spacing: ${cVar('typographyDesktopH800LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH800TextTransform')};
  `,
  h700: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
  `,
  h600: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH600')};
    letter-spacing: ${cVar('typographyDesktopH600LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH600TextTransform')};
  `,
  h500: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH500')};
    letter-spacing: ${cVar('typographyDesktopH500LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH500TextTransform')};
  `,
  h400: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH400')};
    letter-spacing: ${cVar('typographyDesktopH400LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH400TextTransform')};
  `,
  h300: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH300')};
    letter-spacing: ${cVar('typographyDesktopH300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH300TextTransform')};
  `,
  h200: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH200')};
    letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH200TextTransform')};
  `,
  h100: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopH100')};
    letter-spacing: ${cVar('typographyDesktopH100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH100TextTransform')};
  `,
  t500: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT500')};
    letter-spacing: ${cVar('typographyDesktopT500LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT500TextTransform')};
  `,
  't500-strong': styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT500Strong')};
    letter-spacing: ${cVar('typographyDesktopT500StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT500StrongTextTransform')};
  `,
  t400: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT400')};
    letter-spacing: ${cVar('typographyDesktopT400LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT400TextTransform')};
  `,
  't400-strong': styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT400Strong')};
    letter-spacing: ${cVar('typographyDesktopT400StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT400StrongTextTransform')};
  `,
  t300: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT300')};
    letter-spacing: ${cVar('typographyDesktopT300LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT300TextTransform')};
  `,
  't300-strong': styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT300Strong')};
    letter-spacing: ${cVar('typographyDesktopT300StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT300StrongTextTransform')};
  `,
  t200: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
  `,
  't200-strong': styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT200Strong')};
    letter-spacing: ${cVar('typographyDesktopT200StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200StrongTextTransform')};
  `,
  t100: styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT100')};
    letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100TextTransform')};
  `,
  't100-strong': styled.span<TextBaseProps>`
    ${baseStyles};

    font: ${cVar('typographyDesktopT100Strong')};
    letter-spacing: ${cVar('typographyDesktopT100StrongLetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100StrongTextTransform')};
  `,
  'no-variant': styled.span<TextBaseProps>`
    ${baseStyles};
  `,
}
