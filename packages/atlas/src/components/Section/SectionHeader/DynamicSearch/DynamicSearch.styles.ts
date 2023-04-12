import styled from '@emotion/styled'

import { Input } from '@/components/_inputs/Input'
import { media } from '@/styles'

export const SearchInput = styled(Input)`
  max-width: 100%;
  ${media.md} {
    width: 240px;
  }
`

export const SectionSearchWrapper = styled.div<{ isMobileSearchOpen: boolean }>`
  width: ${({ isMobileSearchOpen }) => (isMobileSearchOpen ? '100%' : 'unset')};
  ${media.md} {
    width: unset;
  }
`
