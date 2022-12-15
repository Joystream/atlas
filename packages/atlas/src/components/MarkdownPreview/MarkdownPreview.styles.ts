import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const MarkdownLink = styled.a`
  font: ${cVar('typographyDesktopT300')};
  color: ${cVar('colorTextPrimary')}!important;
  text-decoration: underline !important;
`

export const MarkdownHr = styled.hr`
  margin: ${sizes(4)} 0;
  border: 1px solid ${cVar('colorCoreNeutral600')};
`
