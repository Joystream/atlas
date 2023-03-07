import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const PlaylistWidgetWrapper = styled.div<{ maxHeight: number }>`
  background-color: ${cVar('colorBackgroundMuted')};
`

export const PlaylistHeader = styled.header`
  padding: ${sizes(4)} ${sizes(6)};
  display: flex;
  justify-content: space-between;
  box-shadow: ${cVar('effectDividersBottom')};
  align-items: center;
  cursor: pointer;
`

export const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  min-width: 0;
  word-break: break-all;
`

export const PlaylistInfoWrapper = styled.div``

type PlaylistBodyProps = {
  isExpanded: boolean
  maxHeight: number
}

export const PlaylistBody = styled.div<PlaylistBodyProps>`
  max-height: 400px;
  overflow: auto;
  transition: max-height ${cVar('animationTransitionFast')};
  ${media.md} {
    max-height: ${({ maxHeight, isExpanded }) => (isExpanded ? maxHeight : 0)}px;
  }
`

export const TileList = styled.ol`
  padding: 0;
  list-style: none;
  margin: ${sizes(4)} 0;
`

export const TileItemWrapper = styled.li`
  padding: ${sizes(2)};
  display: flex;
  align-items: center;
  text-decoration: none;

  :hover {
    background-color: ${cVar('colorBackgroundAlpha')};
    transition: background-color ${cVar('animationTransitionFast')};
  }
`

export const Counter = styled(Text)`
  width: 30px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
`
