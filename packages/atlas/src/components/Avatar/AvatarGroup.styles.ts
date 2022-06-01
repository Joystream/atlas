import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, square } from '@/styles'

import { sharedAvatarActiveStyles, sharedAvatarHoverStyles } from './Avatar.styles'

import { Avatar } from '.'

export type AvatarGroupSize = 'small' | 'medium' | 'large'

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

export const StyledAvatar = styled(Avatar)`
  transition: transform ${cVar('animationTransitionFast')};
`

type AvatarGroupContainerProps = {
  size?: AvatarGroupSize
  shouldHighlightEveryAvatar?: boolean
}

export const AvatarGroupContainer = styled.div<AvatarGroupContainerProps>`
  display: inline-grid;
  grid-row: auto;
  ${({ shouldHighlightEveryAvatar }) =>
    shouldHighlightEveryAvatar &&
    css`
      :hover ${StyledAvatar} {
        ${sharedAvatarHoverStyles};
      }
      :active ${StyledAvatar} {
        ${sharedAvatarActiveStyles};
      }
    `};
  ${getSizeOfGridColumn};
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
  background-color: ${cVar('colorCoreBaseBlack')};
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
