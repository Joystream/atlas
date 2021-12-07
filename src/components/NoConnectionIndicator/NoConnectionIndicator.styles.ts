import styled from '@emotion/styled'

import { cVar, media, oldColors, sizes, zIndex } from '@/styles'

export const CONNECTION_INDICATOR_CLASSNAME = 'connection-indicator'
export const ENTER_TRANSITION_DELAY = 1000

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-right: ${sizes(2)};
`

export const IndicatorWrapper = styled.div`
  display: flex;
  position: fixed;
  top: calc(var(--size-topbar-height) + ${sizes(4)});
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  align-items: center;
  z-index: ${zIndex.globalOverlay};
  background-color: ${oldColors.gray[600]};
  padding: ${sizes(3)} ${sizes(5)};
  ${media.md} {
    margin-left: var(--size-sidenav-width-collapsed);
  }

  &.${CONNECTION_INDICATOR_CLASSNAME}-enter {
    opacity: 0;
  }

  &.${CONNECTION_INDICATOR_CLASSNAME}-enter-active {
    opacity: 1;
  }

  &.${CONNECTION_INDICATOR_CLASSNAME}-exit {
    opacity: 1;
  }

  &.${CONNECTION_INDICATOR_CLASSNAME}-exit-active {
    opacity: 0;
  }
  &.${CONNECTION_INDICATOR_CLASSNAME}-enter-active, .${CONNECTION_INDICATOR_CLASSNAME}-exit-active {
    transition: opacity ${cVar('animationTransitionMedium')};
  }
  &.${CONNECTION_INDICATOR_CLASSNAME}-enter-active {
    transition-delay: opacity ${ENTER_TRANSITION_DELAY}ms;
  }
`
