import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { colors, sizes, transitions, zIndex } from '../../theme'
import { Text, Icon } from '@/shared/components'

type ContainerProps = {
  isActive?: boolean
  position: { x: number; y: number; left: boolean }
}

export const StyledContainer = styled.div<ContainerProps>`
  position: absolute;
  visibility: ${({ isActive }) => (isActive ? 'visible' : 'hidden')};
  top: ${({ position }) => position.y}px;
  opacity: ${({ isActive }) => (isActive ? '1' : '0')};
  transform: scale(${({ isActive }) => (isActive ? '1' : '0.88')});
  background-color: ${colors.gray[800]};
  width: 200px;
  color: ${colors.white};
  padding: ${sizes(2)};
  z-index: ${zIndex.globalOverlay};
  transition: opacity 200ms ${transitions.easing}, transform 200ms ${transitions.easing};
  ${({ position }) =>
    position.left
      ? css`
          left: ${position.x}px;
        `
      : css`
          right: ${position.x}px;
        `}
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

export const StyledIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`

export const StyledText = styled(Text)`
  font-size: 14px;
  font-weight: 700px;
  line-height: 16px;
  margin-left: ${sizes(3)};
`
