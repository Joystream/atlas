import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const ItemWrapper = styled.div`
  position: relative;
  width: fit-content;
`

const ChevronContainerStyles = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 36px;
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

export const NavigationContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  cursor: pointer;
  inset: 0;
  z-index: 1000;
  background: black;
  opacity: 0.4;

  > * {
    flex: 1;
  }
`
