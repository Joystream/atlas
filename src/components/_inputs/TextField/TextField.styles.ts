import styled from '@emotion/styled'

import { sizes } from '@/styles'

export const TextInput = styled.input<{ leftNodeWidth: number; rightNodeWidth: number }>`
  width: 100%;
  padding-left: ${({ leftNodeWidth }) => (leftNodeWidth ? `${leftNodeWidth}px !important` : 'inherit')};
  padding-right: ${({ rightNodeWidth }) => (rightNodeWidth ? `${rightNodeWidth}px !important` : 'inherit')};
`

export const TextFieldContainer = styled.div`
  position: relative;
`

export const NodeContainer = styled.div<{ left?: boolean }>`
  position: absolute;
  display: flex;
  align-items: center;
  height: 50px;
  z-index: 2;
  top: 0;
  padding: 0 ${sizes(4)};
  ${({ left }) => (left ? 'left: 0px' : 'right: 0px')};
`
