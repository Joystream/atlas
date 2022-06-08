import styled from '@emotion/styled'

import { Input } from '@/components/_inputs/Input'
import { sizes } from '@/styles'

export const StyledInput = styled(Input)`
  margin-bottom: ${sizes(5)};
`
export const Wrapper = styled.div<{ isModal?: boolean }>`
  display: grid;
  gap: ${({ isModal }) => (isModal ? sizes(6) : sizes(8))};
`
