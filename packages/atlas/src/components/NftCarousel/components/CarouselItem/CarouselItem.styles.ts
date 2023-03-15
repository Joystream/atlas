import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const ItemWrapper = styled.div`
  position: relative;
  width: fit-content;
  height: 200px;

  img {
    user-select: none;
  }
`

const ChevronContainerStyles = css`
  position: absolute;
  display: flex;
  align-items: center;
  padding: 36px;
  cursor: pointer;
`

export const LeftChevronContainer = styled.div`
  ${ChevronContainerStyles};

  position: absolute;
  inset: 0 0 0 50%;
  justify-content: end;
`

export const RightChevronContainer = styled.div`
  ${ChevronContainerStyles};

  position: absolute;
  inset: 0 50% 0 0;
  justify-content: start;
`
