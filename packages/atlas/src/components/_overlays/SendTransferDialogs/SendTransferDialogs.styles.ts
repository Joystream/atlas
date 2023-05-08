import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/_buttons/Button'
import { sizes, square } from '@/styles'

export const VerticallyCenteredDiv = styled.div`
  display: flex;
  align-items: center;
`

export const PriceWrapper = styled.div`
  margin-bottom: ${sizes(6)};
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

export const FormFieldsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: ${sizes(6)};
`

export const StyledMaxButton = styled(Button)`
  margin-left: auto;
`

export const StyledAvatar = styled(Avatar)`
  ${square('16px')}
`
