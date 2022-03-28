import { css } from '@emotion/react'

import { cVar, sizes } from '@/styles'

export const smallBadgeStyles = css`
  &[data-badge]::after {
    position: absolute;
    height: 16px;
    min-width: 16px;
    padding: 0 ${sizes(1)};
    background: ${cVar('colorBackgroundPrimary')};
    border-radius: 99999px;
    color: ${cVar('colorCoreBaseWhite')};
    content: attr(data-badge);
    font: ${cVar('typographyDesktopT100')};
    letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT100TextTransform')};
    text-align: center;
  }

  &[data-badge^='-']::after,
  &[data-badge='0']::after,
  &[data-badge='false']::after,
  &[data-badge='']::after {
    display: none;
  }

  &[data-badge='true']::after {
    content: '';
    background: ${cVar('colorCoreBaseWhite')};
    border: 4px solid ${cVar('colorBackgroundPrimary')};
  }
`
