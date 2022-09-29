import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { EmojiWrapper } from '@/components/EmojiWrapper'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes } from '@/styles'

export const DetailsWrapper = styled.div`
  ${media.md} {
    padding-left: ${sizes(14)};
  }
`

export const DescriptionContainer = styled.div`
  margin: ${sizes(6)} 0;
`

type DetailsExpandedProps = {
  detailsExpanded?: boolean
}

export const DescriptionBody = styled(EmojiWrapper)<DetailsExpandedProps>`
  overflow: hidden;
  text-overflow: ellipsis;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-line-clamp: ${({ detailsExpanded }) => (detailsExpanded ? 'unset' : 3)};
  line-clamp: ${({ detailsExpanded }) => (detailsExpanded ? 'unset' : 3)};
  -webkit-box-orient: vertical;
  color: ${cVar('colorText')}; /* needed for proper ellipsis color */
`
export const DescriptionCopyWrapper = styled(Text)`
  white-space: pre-wrap;
  word-break: break-word;
`

export const Category = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;

  svg {
    margin-right: ${sizes(2)};
  }
`

export const LicenceCategoryWrapper = styled.div<{ detailsExpanded: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: ${sizes(6)};
  visibility: ${({ detailsExpanded }) => (detailsExpanded ? 'visible' : 'hidden')};
  max-height: ${({ detailsExpanded }) => (detailsExpanded ? '400px' : '0')};
  overflow: ${({ detailsExpanded }) => (detailsExpanded ? 'unset' : 'hidden')};
  opacity: ${({ detailsExpanded }) => (detailsExpanded ? 1 : 0)};
  margin-bottom: ${({ detailsExpanded }) => (detailsExpanded ? sizes(6) : 0)};
  transition: opacity ${cVar('animationTransitionFast')};
`

export const ExpandButton = styled(TextButton)`
  display: block;
  margin-bottom: ${sizes(8)};
`

export const CategoryWrapper = styled.div`
  text-align: left;
  display: grid;
  gap: ${sizes(2)};

  path {
    fill: ${cVar('colorText')};
  }
`

export const DescriptionLink = styled(TextButton)`
  word-break: break-all;
`

export const DescriptionSkeletonLoader = styled(SkeletonLoader)`
  height: 28px;
  margin: ${sizes(4)} 0 0;
`
