import styled from '@emotion/styled'

import { SvgActionTrash } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { Select } from '@/components/_inputs/Select'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
  min-width: 960px;
  height: fit-content;
  padding: ${sizes(4)};
  border-top: 1px solid ${cVar('colorBackgroundStrongAlpha')};

  > *:last-child {
    justify-content: end;

    ::after {
      text-align: end;
    }
  }

  :hover {
    background-color: ${cVar('colorBackgroundAlpha')};
  }

  .playlist-buttons {
    &-enter {
      opacity: 0;
      transform: translateY(100%);
    }

    &-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: transform ${cVar('animationTimingMedium')}, opacity ${cVar('animationTimingMedium')};
    }

    &-exit,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-exit-active {
      opacity: 0;
      transform: translateY(100%);
      transition: transform ${cVar('animationTimingMedium')}, opacity ${cVar('animationTimingMedium')};
    }
  }

  .playlist-info {
    &-enter {
      opacity: 0;
      transform: translateY(-100%);
    }

    &-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: transform ${cVar('animationTimingMedium')}, opacity ${cVar('animationTimingMedium')};
    }

    &-exit,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-exit-active {
      opacity: 0;
      transform: translateY(-100%);
      transition: transform ${cVar('animationTimingMedium')}, opacity ${cVar('animationTimingMedium')};
    }
  }
`

export const Cell = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
`

export const StyledSvgActionTrash = styled(SvgActionTrash)`
  path {
    fill: ${cVar('colorTextError')};
  }
`

export const HoverContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;

  > * {
    width: 100%;
    position: absolute;
  }
`

export const PlaylistDescription = styled(Text)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const StyledPill = styled(Pill)`
  width: fit-content;
`

export const StyledSelect = styled(Select)`
  width: fit-content;
  margin-left: auto;
  padding-bottom: ${sizes(8)};
`

export const VideoThumbnailWrapper = styled.div`
  > *:first-of-type {
    width: 189px;
  }
`

export const StyledThumbnailText = styled(Text)`
  white-space: nowrap;
`
