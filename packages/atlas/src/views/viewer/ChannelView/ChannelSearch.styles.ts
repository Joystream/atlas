import styled from '@emotion/styled'

import { Input } from '@/components/_inputs/Input'
import { media, sizes } from '@/styles'

type TextFieldProps = {
  isOpen?: boolean
  isSearching?: boolean
}
export const StyledInput = styled(Input)<TextFieldProps>`
  width: 100%;
`

export const SearchContainerForm = styled.form`
  display: flex;
  grid-area: search;
  align-items: center;
  margin: ${sizes(8)} 0 ${sizes(2)} 0;
  position: relative;

  ${media.sm} {
    grid-area: initial;
    margin: 0;
    max-width: 200px;
  }
`
