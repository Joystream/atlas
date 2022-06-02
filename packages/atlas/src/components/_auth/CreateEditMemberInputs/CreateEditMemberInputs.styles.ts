import styled from '@emotion/styled'

import { TextField } from '@/components/_inputs/TextField'
import { sizes } from '@/styles'

export const StyledTextField = styled(TextField)`
  margin-bottom: ${sizes(5)};
`
export const Wrapper = styled.div<{ isModal?: boolean }>`
  display: grid;
  gap: ${({ isModal }) => (isModal ? sizes(6) : sizes(8))};
`
