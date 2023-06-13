import styled from '@emotion/styled'

import { TextButton } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
`

export const ForgotPasswordText = styled(TextButton)`
  margin: 0 0 0 auto;
`
