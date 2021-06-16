import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions, typography } from '../../theme'
import { Text } from '../Text'

type ContainerProps = {
  isActive?: boolean
  position: { x: number; y: number; left: boolean }
}

export const StyledContainer = styled.div<ContainerProps>`
  position: absolute;
  top: ${({ position }) => position.y}px;
  left: ${({ position }) => position.left && position.x}px;
  right: ${({ position }) => !position.left && position.x}px;
  background-color: ${colors.gray[800]};
  width: 200px;
  color: ${colors.white};
  padding: ${sizes(2)};
  word-break: break-all;
`

export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(3)};
  transition: background-color 200ms ${transitions.easing};

  &:hover {
    cursor: pointer;
    background-color: ${colors.gray[700]};
  }
`

export const StyledText = styled(Text)`
  font-size: ${typography.sizes.subtitle2};
  font-weight: ${typography.weights.medium};
  line-height: ${sizes(4)};
  margin-left: ${sizes(3)};
`

export const menuTransitions = css`
  &.menu-enter {
    opacity: 0;
    transform: scale(0.88);
  }

  &.menu-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }

  &.menu-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.menu-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`
