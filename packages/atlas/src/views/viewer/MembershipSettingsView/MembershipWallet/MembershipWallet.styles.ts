import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const FormFieldsWrapper = styled.div`
  display: grid;
  gap: ${sizes(8)};
`

export const ChangePasswordButton = styled(Button)`
  margin-top: ${sizes(4)};
  justify-self: flex-start;
`
