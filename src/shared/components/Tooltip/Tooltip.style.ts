import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { colors, sizes, typography, zIndex, transitions } from '@/shared/theme'

type TooltipProps = {
  isActive?: boolean
  arrowDisabled?: boolean
  above?: boolean
  right?: boolean
  offsetY?: number
}

type ChildrenContainerProps = {
  darkenContent?: boolean
}

const positionFromProps = ({ above, right: rightProp, isActive }: TooltipProps) => {
  const top = above ? '0' : 'auto'
  const bottom = above ? 'auto' : '0'
  const right = rightProp ? '0' : 'auto'
  const left = rightProp ? 'auto' : '0'

  return css`
    top: ${top};
    bottom: ${bottom};
    left: ${left};
    right: ${right};
    opacity: ${isActive ? 1 : 0};
  `
}

const transformTooltipFromProps = ({ above, offsetY = 0, isActive }: TooltipProps) => {
  const translate = above ? `calc(-100% + ${offsetY}px)` : `calc(100% + 10px + ${offsetY}px)`
  return css`
    transform: translateY(${translate}) scale(${isActive ? 1 : 1.1});
  `
}

const transformArrowFromProps = ({ above, offsetY = 0, isActive }: TooltipProps) => {
  const rotate = above ? '-90deg' : '90deg'
  const translateX = above
    ? [`calc(0px - ${offsetY}px)`, `calc(8px - ${offsetY}px)`]
    : [`calc(12px + ${offsetY}px)`, '20px']

  return css`
    transform: rotate(${rotate}) translateX(${isActive ? translateX[0] : translateX[1]});
  `
}

export const StyledTooltip = styled.div<TooltipProps>`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  &::before {
    position: absolute;
    display: inline-block;
    content: attr(data-text);
    min-width: 100px;
    width: max-content;
    max-width: 250px;
    font-size: ${typography.sizes.caption};
    font-weight: ${typography.weights.thin};
    line-height: ${sizes(4)};
    padding: ${sizes(2.5)} ${sizes(2)};
    background: ${colors.gray[400]};
    color: ${colors.white};
    z-index: ${zIndex.nearOverlay};
    transition: transform 100ms ${transitions.easing}, opacity 100ms ${transitions.easing};
    pointer-events: none;
    ${positionFromProps}
    ${transformTooltipFromProps}
  }
  &::after {
    position: absolute;
    content: '';
    display: ${({ arrowDisabled }) => (arrowDisabled ? 'none' : 'inline-block')};
    margin: 0 ${sizes(2)};
    border: 10px solid transparent;
    border-right-color: ${colors.gray[400]};
    z-index: ${zIndex.overlay};
    transition: transform 100ms ${transitions.easing}, opacity 100ms ${transitions.easing};
    ${positionFromProps}
    ${transformArrowFromProps}
  }
`

export const ChildrenContainer = styled.div<ChildrenContainerProps>`
  display: inline-block;
  width: 100%;
  transition: filter 200ms ${transitions.easing};
  &:hover {
    filter: ${({ darkenContent }) => darkenContent && 'brightness(90%)'};
  }
`
