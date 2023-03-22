import styled from '@emotion/styled'

import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { cVar, sizes } from '@/styles'

export const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const TypeIconWrapper = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: ${sizes(2)};
  border-radius: 50%;
`

export const StyledNumberFormat = styled(NumberFormat)`
  display: block;
`

export const JoyAmountWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)<{ error: boolean }>`
  path {
    fill: ${({ error }) => (error ? cVar('colorTextError') : undefined)};
  }
`
