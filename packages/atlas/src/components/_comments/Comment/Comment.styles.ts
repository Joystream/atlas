import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgActionTrash } from '@/assets/icons'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes, square } from '@/styles'

export const KebabMenuIconButton = styled(Button)<{ isActive: boolean }>`
  opacity: 0;
  pointer-events: ${({ isActive }) => (isActive ? 'auto' : 'none')};

  @media (any-pointer: coarse) {
    opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  }
`

export const CommentWrapper = styled.div<{ shouldShowKebabButton: boolean; isUnconfirmed?: boolean }>`
  display: grid;
  gap: ${sizes(3)};
  align-items: start;
  opacity: ${(props) => (props.isUnconfirmed ? '0.8' : 'unset')};

  /* comment content, kebab button */
  grid-template-columns: 1fr auto;

  :hover {
    ${KebabMenuIconButton} {
      opacity: ${({ shouldShowKebabButton }) => (shouldShowKebabButton ? 1 : 0)};
    }
  }
`

export const CommentArticle = styled.article<{ isDeleted?: boolean }>`
  display: grid;
  grid-auto-flow: row;
  justify-items: start;
  gap: ${({ isDeleted }) => (isDeleted ? sizes(3) : sizes(2))};
  align-items: start;
`

export const CommentHeader = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const isPropValid = (prop: PropertyKey) => prop !== 'isProcessing'

export const StyledLink = styled(Link, { shouldForwardProp: isPropValid })<{ isProcessing?: boolean }>`
  text-decoration: none;
  pointer-events: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
  touch-action: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
`

export const CommentHeaderDot = styled.div`
  background-color: ${cVar('colorBackgroundStrongAlpha')};
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

export const CommentFooter = styled.footer<{ isProcessing?: boolean }>`
  pointer-events: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
  touch-action: ${({ isProcessing }) => (isProcessing ? 'none' : 'unset')};
`

export const ReactionsAndPopover = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: ${sizes(1)};
  justify-content: start;
  margin-left: -${sizes(2)};
`

export const ReactionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${sizes(3)};
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

export const ReplyButton = styled(Button)`
  :not(:only-child) {
    margin-left: ${sizes(3)};
  }
`

export const ReplyButtonWrapper = styled.div`
  :not(:only-child) {
    margin-left: ${sizes(3)};
  }
`
