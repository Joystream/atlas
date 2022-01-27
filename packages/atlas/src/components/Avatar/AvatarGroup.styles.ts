import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, square } from '@/styles'

import { Avatar } from '.'

export type AvatarGroupSize = 'small' | 'medium' | 'large'

export type AvatarGroupContainerProps = {
  size?: AvatarGroupSize
}

const getSizeOfGridColumn = ({ size }: AvatarGroupContainerProps) => {
  // grid-auto-columns = size of the avatar - offset
  switch (size) {
    case 'small':
      return css`
        grid-auto-columns: 20px;
        padding-right: 4px;
      `
    case 'medium':
      return css`
        grid-auto-columns: 24px;
        padding-right: 8px;
      `
    case 'large':
      return css`
        grid-auto-columns: 32px;
        padding-right: 8px;
      `
  }
}

export const AvatarGroupContainer = styled.div<{ size: AvatarGroupSize }>`
  display: inline-grid;
  grid-row: auto;
  ${getSizeOfGridColumn};
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

type AvatatBackgroundProps = {
  avatarStrokeColor?: string
}

export const AvatarBackground = styled.div<AvatatBackgroundProps>`
  position: absolute;
  ${square('100%')};
  border-radius: 50%;
  top: 0;
  background-color: ${({ avatarStrokeColor = 'black' }) => avatarStrokeColor};
  transition: transform ${cVar('animationTransitionFast')};
`

type AvatarOverlayProps = {
  dimmed?: boolean
}

export const AvatarOverlay = styled.div<AvatarOverlayProps>`
  pointer-events: none;
  position: absolute;
  top: 0;
  ${square('100%')}
  border-radius: 50%;
  background-color: black;
  opacity: ${({ dimmed }) => (dimmed ? 0.5 : 0)};
  transition: opacity ${cVar('animationTransitionFast')};
`

type AvatarWrapperProps = {
  size: AvatarGroupSize
  clickable: boolean
  avatarStrokeColor?: string
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
  position: relative;
  border-radius: 50%;
  width: calc(100% + ${({ size }) => (size === 'small' ? 4 : 8)}px);
  grid-row: 1;

  ${({ clickable }) =>
    clickable &&
    css`
      :hover {
        ${StyledAvatar}, ${AvatarBackground}, ${AvatarOverlay} {
          transform: translateY(-8px);
        }
        ${AvatarOverlay} {
          opacity: 0;
        }
      }
    `};

  ${StyledAvatar} {
    box-shadow: 0 0 0 4px ${({ avatarStrokeColor = 'black' }) => avatarStrokeColor};
  }
`
