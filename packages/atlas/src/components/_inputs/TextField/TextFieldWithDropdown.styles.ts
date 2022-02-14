import styled from '@emotion/styled'

import { cVar } from '@/styles'

export const TextFieldWithDropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const ListWrapper = styled.ul`
  max-height: 300px;
  overflow-y: auto;
  background: ${cVar('colorBackgroundStrong')};
  padding: 0;
  position: absolute;
  width: 100%;
  margin: 0;
`
