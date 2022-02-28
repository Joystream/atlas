import styled from '@emotion/styled'

import { cVar, zIndex } from '@/styles'

export const TextFieldWithDropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const ListWrapper = styled.ul<{ topPosition?: number }>`
  max-height: 300px;
  overflow-y: auto;
  background: ${cVar('colorBackgroundStrong')};
  padding: 0;
  position: absolute;
  top: ${({ topPosition }) => (topPosition ? `${topPosition}px` : 'unset')};
  left: 0;
  width: 100%;
  z-index: ${zIndex.globalOverlay};
  margin: 0;
`
