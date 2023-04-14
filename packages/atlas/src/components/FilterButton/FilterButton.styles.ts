import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const Counter = styled.div`
  height: 16px;
  width: 16px;
  background-color: ${cVar('colorBackgroundPrimary')};
  border-radius: 50%;
  text-align: center;
  font: ${cVar('typographyDesktopT100')};
  color: ${cVar('colorTextStrong')};
`

export const StyledButton = styled(Button)`
  > svg > path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const InputsContainer = styled.div`
  display: flex;
  gap: ${sizes(2)};
`
