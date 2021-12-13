import { css } from '@emotion/react'

import { cVar, oldColors, sizes } from '@/styles'

export const smallBadgeStyles = css`
  &[data-badge]::after {
    position: absolute;
    width: ${sizes(4)};
    height: ${sizes(4)};
    background: ${oldColors.blue[500]};
    border-radius: 100%;
    color: #fff;
    content: attr(data-badge);
    font: ${cVar('typographyDesktopT100')};
    letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100TextTransform')};
    padding-top: 1px;
    text-align: center;
    line-height: 14px;
    font-weight: normal;
  }

  &[data-badge^='-']::after,
  &[data-badge='0']::after,
  &[data-badge='']::after {
    display: none;
  }
`
