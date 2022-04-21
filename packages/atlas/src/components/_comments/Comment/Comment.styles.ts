import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionTrash } from '@/components/_icons'
import { cVar, sizes, square } from '@/styles'

export const KebabMenuIconButton = styled(IconButton)<{ isActive: boolean }>`
  opacity: 0;
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};

  @media (any-pointer: coarse) {
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  }
`

export const CommentWrapper = styled.div<{ shouldShowKebabButton: boolean }>`
  display: grid;
  gap: ${sizes(3)};
  align-items: start;

  /* comment content, kebab button */
  grid-template-columns: 1fr auto;

  :hover {
    ${KebabMenuIconButton} {
      opacity: ${({ shouldShowKebabButton: isActive }) => (isActive ? 1 : 0)};
    }
  }
`

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${sizes(2)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
`

export const CommentHeaderDot = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  border-radius: 100%;

  ${square(4)};
`

export const HighlightableText = styled(Text)`
  cursor: pointer;

  :hover {
    transition: color ${cVar('animationTransitionFast')};
    color: ${cVar('colorTextStrong')};
  }
`

export const StyledSvgActionTrash = styled(SvgActionTrash)`
  margin-right: ${sizes(2)};

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const CommentBody = styled(Text)`
  display: flex;
  align-items: center;
`
