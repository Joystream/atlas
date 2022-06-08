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

export const DescriptionTitle = styled(Text)`
  margin-bottom: ${sizes(2)};
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
`

export const DescriptionCopy = styled(Text)<DetailsExpandedProps>`
  /* this fixes Safari issue with line-clamp - it works only for inline elements
  once the description is expanded we don't need clamp anymore */
  display: ${({ detailsExpanded }) => (detailsExpanded ? 'block' : 'inline')};
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

export const LicenseCustomText = styled(Text)`
  margin-top: ${sizes(2)};
`

export const ExpandButton = styled(TextButton)`
  display: block;
  margin-bottom: ${sizes(8)};
`

export const CategoryWrapper = styled.div`
  text-align: left;

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
