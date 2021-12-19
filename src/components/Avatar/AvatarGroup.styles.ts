import styled from '@emotion/styled'

import { Avatar, AvatarSize } from '.'

export const StyledAvatar = styled(Avatar)`
  box-shadow: 0 0 0 4px black;
  transition: clip-path 200ms, transform 200ms;
`
export const AvatarOverlay = styled.div`
  background-color: black;
  width: 100%;
  border-radius: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  transition: opacity 200ms;
  opacity: 0.5;
`

export const AvatarWrapper = styled.div<{ idx: number; size: AvatarSize }>`
  position: relative;
  z-index: 1;
  border-radius: 50%;
  transition: clip-path 200ms, transform 200ms;
  left: ${({ idx }) => idx * -8}px;

  :hover {
    z-index: 2;
    clip-path: none;
    ${StyledAvatar} {
      transform: translateY(-8px);
    }
    ${AvatarOverlay} {
      opacity: 0;
      transform: translateY(-8px);
    }
  }
`

export const AvatarGroupContainer = styled.div`
  position: relative;
  display: flex;
`
