import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { cVar, sizes, square } from '@/styles'

export const GAP_BETWEEN_COMMENT_SNAPSHOTS = sizes(8, true)

export const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Line = styled.div`
  top: ${GAP_BETWEEN_COMMENT_SNAPSHOTS}px;
  background-color: ${cVar('colorBorderMutedAlpha')};
  position: absolute;
  width: 1px;
  height: 100%;
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

export const CommentHeaderDot = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  border-radius: 100%;

  ${square(4)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`
