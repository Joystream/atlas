import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, sizes, zIndex } from '@/styles'

export const ItemWrapper = styled.div`
  position: relative;
`

const ChevronContainerStyles = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${sizes(3)};

  ${media.sm} {
    padding: ${sizes(9)};
  }
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
  opacity: 1;
`

export const NavigationContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  cursor: pointer;
  inset: 0;
  z-index: ${zIndex.modals};

  > * {
    flex: 1;
  }

  ::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    opacity: 0.7;
    background: ${cVar('colorBackgroundMuted')};
    transition: opacity ${cVar('animationTransitionMedium')};
  }

  :hover {
    ::after {
      opacity: 0.55;
    }
  }
`
