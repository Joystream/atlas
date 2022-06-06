import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { SvgActionTrash } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes, square } from '@/styles'

export const KebabMenuIconButton = styled(Button)<{ isActive: boolean }>`
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

export const CommentHeader = styled.div<{ isDeleted: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${({ isDeleted }) => (isDeleted ? sizes(3) : sizes(2))};
`

export const StyledLink = styled(Link)<{ isProcessing?: boolean }>`
  text-decoration: none;
  pointer-events: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
  touch-action: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
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

export const DeletedComment = styled(Text)`
  display: flex;
  white-space: pre-line;
  align-items: center;
`

export const CommentFooter = styled.div`
  margin-top: ${sizes(2)};
`

export const CommentFooterItems = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-rows: auto;
  gap: ${sizes(2)};

  ${media.sm} {
    align-items: center;
    grid-template-columns: auto 1fr;
    gap: ${sizes(1)};
  }
`

export const ReactionsWrapper = styled.div`
  display: inline-grid;
  grid-auto-flow: column;
  gap: 4px;
  justify-content: flex-start;
`

export const StyledFooterSkeletonLoader = styled(SkeletonLoader)`
  border-radius: 999px;
`

export const RepliesWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  ${media.sm} {
    margin-left: ${sizes(3)};
  }
`

export const ShowRepliesTextButton = styled(TextButton)`
  margin-left: ${sizes(2)};
`

export const ReplyButton = styled(Button)`
  :not(:only-child) {
    margin-left: ${sizes(3)};
  }
`
