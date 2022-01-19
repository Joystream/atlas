import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'

import { Avatar } from '.'

export type AvatarGroupSize = 'small' | 'medium' | 'large'
export type AvatarGroupDirection = 'left' | 'right'

export const AvatarGroupContainer = styled.div<{ direction: AvatarGroupDirection }>`
  position: relative;
  display: flex;
  justify-content: ${({ direction }) => (direction === 'left' ? 'flex-start' : 'flex-end')};
`

export const StyledAvatar = styled(Avatar)`
  transition: transform ${cVar('animationTransitionFast')}, box-shadow ${cVar('animationTransitionFast')};

  :hover {
    ::after {
      box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
    }
  }

  :active {
    ::after {
      box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
    }
  }
`

export const AvatarOverlay = styled.div<{ dimmed?: boolean }>`
  pointer-events: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  top: 0;
  background-color: black;
  opacity: ${({ dimmed }) => (dimmed ? 0.5 : 0)};
  transition: opacity ${cVar('animationTransitionFast')};
`

type AvatarWrapperProps = {
  idx: number
  size: AvatarGroupSize
  clickable: boolean
  avatarStrokeColor?: string
  direction: AvatarGroupDirection
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
  position: relative;
  border-radius: 50%;
  background-color: ${({ avatarStrokeColor = 'black' }) => avatarStrokeColor};

  ${({ direction, idx, size }) => {
    if (direction === 'left') {
      return css`
        left: ${-idx * (size === 'small' ? 4 : 8)}px;
      `
    }
    if (direction === 'right') {
      return css`
        right: ${-idx * (size === 'small' ? 4 : 8)}px;
      `
    }
  }};
  ${({ clickable }) =>
    clickable &&
    css`
      :hover {
        ${StyledAvatar} {
          transform: translateY(-8px);
        }
        ${AvatarOverlay} {
          opacity: 0;
          transform: translateY(-8px);
        }
      }
    `};
  ${StyledAvatar} {
    box-shadow: 0 0 0 4px ${({ avatarStrokeColor = 'black' }) => avatarStrokeColor};
  }
`
