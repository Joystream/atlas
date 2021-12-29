import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'

import { Avatar, AvatarSize } from '.'

type StyledAvatarProps = {
  avatarStrokeColor?: string
}

export const AvatarGroupContainer = styled.div`
  position: relative;
  display: flex;
`

export const StyledAvatar = styled(Avatar)<StyledAvatarProps>`
  transition: transform ${cVar('animationTransitionFast')};
  box-shadow: 0 0 0 4px ${({ avatarStrokeColor = 'black' }) => avatarStrokeColor};

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
  size: AvatarSize
  clickable: boolean
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
  position: relative;
  border-radius: 50%;
  transition: transform ${cVar('animationTransitionFast')};
  left: ${({ idx, size }) => idx * (size === 'bid' ? -5 : -8)}px;
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
`
