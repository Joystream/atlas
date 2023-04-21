import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const StyledImg = styled.img`
  object-fit: cover;
  min-width: 100%;
`

export const HeaderWrapper = styled.header`
  padding: ${sizes(6)};
`

export const CheckboxWrapper = styled.div`
  box-shadow: ${cVar('effectDividersTop')}, ${cVar('effectDividersBottom')};
  background-color: ${cVar('colorBackgroundElevated')};
  padding: ${sizes(4)} ${sizes(6)};
  margin-bottom: ${sizes(6)};
  display: flex;
  align-items: center;
`
