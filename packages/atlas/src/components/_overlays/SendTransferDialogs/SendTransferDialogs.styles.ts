import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

const verticallyCenteredFlex = css`
  display: flex;
  align-items: center;
`

export const BalanceWrapper = styled.div`
  ${verticallyCenteredFlex}
`

export const Summary = styled.div`
  margin-top: ${sizes(6)};
`

export const SummaryRow = styled.div`
  display: grid;
  justify-content: space-between;
  grid-template: auto auto / 1fr auto;
  gap: ${sizes(2)};
`

export const DestinationAccountWrapper = styled.div`
  ${verticallyCenteredFlex}
`

export const FeeWrapper = styled.div`
  display: grid;
  align-items: center;
  gap: ${sizes(1)};
  grid-template: auto / auto auto;
`

export const FormFieldsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: ${sizes(6)};
`
