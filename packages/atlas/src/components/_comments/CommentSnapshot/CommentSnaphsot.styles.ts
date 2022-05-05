import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar, sizes, square } from '@/styles'

export const GAP_BETWEEN_COMMENT_SNAPSHOTS = sizes(8, true)
const AVATAR_HEIGHT = sizes(10, true)

export const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Line = styled.div`
  position: absolute;
  top: ${AVATAR_HEIGHT}px;
  background-color: ${cVar('colorBorderMutedAlpha')};
  width: 1px;
  height: calc(100% - (${AVATAR_HEIGHT}px - ${GAP_BETWEEN_COMMENT_SNAPSHOTS}px));
`

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${sizes(4)};
`

export const CommentHeader = styled.header`
  display: inline-grid;
  gap: ${sizes(2)};
  align-items: center;

  /* author, dot, date */
  grid-template-columns: repeat(3, auto);
`
export const CommentBody = styled(Text)`
  white-space: pre;
`

export const CommentHeaderDot = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  border-radius: 100%;

  ${square(4)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`
