import styled from '@emotion/styled'
import { colors, sizes, typography, zIndex, transitions } from '@/shared/theme'

type TooltipProps = {
  isActive?: boolean
  arrowDisabled?: boolean
}

type ChildrenContainerProps = {
  darkenContent?: boolean
}

export const StyledTooltip = styled.div<TooltipProps>`
  position: relative;
  display: inline-block;
  &::before {
    position: absolute;
    display: inline-block;
    content: attr(data-text);
    bottom: 0;
    transform: translateY(calc(100% + 10px)) scale(${({ isActive }) => (isActive ? 1 : 1.1)});
    min-width: 100px;
    max-width: 200px;
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    font-size: ${typography.sizes.caption};
    font-weight: ${typography.weights.thin};
    line-height: ${sizes(4)};
    padding: ${sizes(2.5)} ${sizes(2)};
    background: ${colors.gray[400]};
    color: ${colors.white};
    z-index: ${zIndex.nearOverlay};
    transition: transform 100ms ${transitions.easing}, opacity 100ms ${transitions.easing};
  }
  &::after {
    position: absolute;
    content: '';
    bottom: 0;
    margin-left: ${sizes(2)};
    transform: rotate(90deg) translateX(${({ isActive }) => (isActive ? sizes(3) : sizes(5))});
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    display: ${({ arrowDisabled }) => (arrowDisabled ? 'none' : 'inline-block')};
    border: 10px solid transparent;
    border-right-color: ${colors.gray[400]};
    z-index: ${zIndex.overlay};
    transition: transform 100ms ${transitions.easing}, opacity 100ms ${transitions.easing};
  }
`

export const ChildrenContainer = styled.div<ChildrenContainerProps>`
  transition: filter 200ms ${transitions.easing};
  &:hover {
    filter: ${({ darkenContent }) => darkenContent && 'brightness(90%)'};
  }
`
