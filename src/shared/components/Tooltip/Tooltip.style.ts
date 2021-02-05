import styled from '@emotion/styled'
import { colors, sizes, typography, zIndex, transitions } from '@/shared/theme'

type TooltipProps = {
  isActive?: boolean
  arrowDisabled?: boolean
}

export const StyledTooltip = styled.div<TooltipProps>`
  position: relative;
  width: fit-content;
  &:before {
    position: absolute;
    display: inline-block;
    content: attr(data-text);
    bottom: 0;
    transform: translateY(calc(100% + 5px)) scale(${({ isActive }) => (isActive ? 1 : 1.1)});
    min-width: 100px;
    max-width: 200px;
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    font-size: ${typography.sizes.caption};
    font-weight: ${typography.weights.thin};
    padding: ${sizes(1)} ${sizes(2)};
    background: ${colors.gray[400]};
    color: ${colors.white};
    z-index: ${zIndex.nearOverlay};
    transition: 100ms;
  }
  &:after {
    position: absolute;
    content: '';
    bottom: 0;
    margin-left: ${sizes(2)};
    transform: rotate(90deg) translateX(${({ isActive }) => (isActive ? sizes(2.5) : sizes(4))});
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    display: ${({ arrowDisabled }) => (arrowDisabled ? 'none' : 'inline-block')};
    border: 10px solid transparent;
    border-right-color: ${colors.gray[400]};
    z-index: ${zIndex.overlay};
    transition: 100ms;
  }
`

export const ChildrenContainer = styled.div`
  width: fit-content;
  transition: 0.2s;
  &:hover {
    filter: brightness(90%);
  }
`
