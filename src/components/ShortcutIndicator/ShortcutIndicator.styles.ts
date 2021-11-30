import styled from '@emotion/styled'

import { cVar, oldColors, sizes, square } from '@/styles'

export const ShortcutIndicator = styled.kbd`
  ${square(16)};

  color: ${oldColors.gray[300]};
  font: ${cVar('typographyDesktopT100')};
  letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT100TextTransform')};
  border: 1px solid ${oldColors.gray[500]};
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: ${sizes(2)};
`
