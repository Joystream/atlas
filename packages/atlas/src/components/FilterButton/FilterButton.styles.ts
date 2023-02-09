import styled from '@emotion/styled'

import { cVar } from '@/styles'

export const Counter = styled.div`
  height: 16px;
  width: 16px;
  background-color: ${cVar('colorBackgroundPrimary')};
  border-radius: 50%;
  text-align: center;
  font: ${cVar('typographyDesktopT100')};
  color: ${cVar('colorTextStrong')};
`
