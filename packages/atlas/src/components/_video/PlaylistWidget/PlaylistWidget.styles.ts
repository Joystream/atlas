import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const PlaylistWidgetWrapper = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};
`

export const PlaylistHeader = styled.header`
  padding: ${sizes(4)} ${sizes(6)};
  display: flex;
  justify-content: space-between;
  box-shadow: ${cVar('effectDividersBottom')};
  align-items: center;
`

export const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`

export const PlaylistInfoWrapper = styled.div``

type PlaylistBodyProps = {
  isExpanded: boolean
  maxHeight: number
}

export const PlaylistBody = styled.div<PlaylistBodyProps>`
  max-height: ${({ maxHeight, isExpanded }) => (isExpanded ? maxHeight : 0)}px;
  overflow: auto;
  height: auto;
  transition: max-height ${cVar('animationTransitionFast')};
`

export const TileList = styled.ol`
  padding: 0;
  list-style: none;
  margin: ${sizes(4)} 0;
`

export const TileItemWrapper = styled.li`
  display: flex;
  align-items: center;
  padding: ${sizes(2)};
`

export const Counter = styled(Text)`
  width: 30px;
  display: flex;
  justify-content: center;
`
