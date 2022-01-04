import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

type NodeWidth = { leftNodeWidth: number; rightNodeWidth: number }
export const TextInput = styled.input<NodeWidth>`
  width: 100%;
  padding-left: ${({ leftNodeWidth }) => (leftNodeWidth ? `${leftNodeWidth}px !important` : 'inherit')};
  padding-right: ${({ rightNodeWidth }) => (rightNodeWidth ? `${rightNodeWidth}px !important` : 'inherit')};
`

export const TextFieldContainer = styled.div`
  position: relative;
`

type PlacementProps = {
  left?: boolean
}
const nodePlacementStyles = ({ left }: PlacementProps) =>
  left
    ? css`
        left: 0;
      `
    : css`
        right: 0;
      `
export const NodeContainer = styled.div<PlacementProps>`
  position: absolute;
  display: flex;
  align-items: center;
  z-index: 2;
  top: 0;
  bottom: 0;
  padding: 0 ${sizes(4)};
  ${nodePlacementStyles};
`
