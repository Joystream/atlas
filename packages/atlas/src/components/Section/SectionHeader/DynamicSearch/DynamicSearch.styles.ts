import styled from '@emotion/styled'

import { Input } from '@/components/_inputs/Input'
import { media } from '@/styles'

export const SearchInput = styled(Input)`
  max-width: 100%;
  ${media.sm} {
    width: 240px;
  }
`

export const SectionSearchWrapper = styled.div`
  width: 100%;
  ${media.sm} {
    width: unset;
  }
`
