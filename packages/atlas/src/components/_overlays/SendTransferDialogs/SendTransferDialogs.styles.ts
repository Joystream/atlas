import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const VerticallyCenteredDiv = styled.div`
  display: flex;
  align-items: center;
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

export const StyledMaxButton = styled(Button)`
  margin-left: auto;
`
