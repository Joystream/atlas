import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, sizes } from '@/styles'

export const ActivityItemContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'loading' })<{
  loading?: boolean
}>`
  padding: ${sizes(4)};
  text-decoration: none;
  display: grid;
  gap: ${sizes(4)} 0;
  grid-template-columns: 1fr auto;
  align-items: center;
  transition: background-color ${cVar('animationTransitionFast')};
  background-color: ${cVar('colorBackgroundMuted')};
  cursor: ${({ loading }) => !loading && 'pointer'};

  &:hover {
    background-color: ${({ loading }) => (loading ? cVar('colorBackgroundMuted') : cVar('colorBackgroundAlpha'))};
  }

  ${media.sm} {
    grid-template-columns: auto 1fr auto;
  }

  ${media.lg} {
    grid-template-columns: auto 1fr auto;
    padding: ${sizes(6)};
  }
`
export const PillAndDateContainer = styled.div`
  display: grid;
  grid-template-rows: max-content max-content;
  gap: ${sizes(2)};
  justify-items: end;
  align-content: center;
`
export const TitleAndDescriptionContainer = styled.div`
  display: grid;
  gap: ${sizes(1)};
  grid-column-end: span 2;
  grid-row-start: 2;

  ${media.sm} {
    gap: ${sizes(2)};
    margin: 0 ${sizes(4)} 0 ${sizes(6)};
    grid-column-end: initial;
    grid-row-start: initial;
    align-content: center;
    grid-auto-rows: min-content;
  }

  ${media.lg} {
    margin: 0 ${sizes(6)};
  }
`
export const Title = styled(Text)`
  word-break: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const Thumbnail = styled.img`
  height: 40px;

  ${media.sm} {
    height: 64px;
  }

  ${media.lg} {
    height: 80px;
  }
`
export const ThumbnailSkeletonLoader = styled(SkeletonLoader)`
  width: 71px;
  height: 40px;

  ${media.sm} {
    width: 114px;
    height: 64px;
  }

  ${media.lg} {
    width: 142px;
    height: 80px;
  }
`

export const PillSkeletonLoader = styled(SkeletonLoader)`
  width: 40px;
  height: 20px;
  align-self: flex-start;
  ${media.sm} {
    align-self: unset;
  }
`

export const TitleSkeletonLoader = styled(SkeletonLoader)`
  width: 160px;
  height: 20px;
  ${media.sm} {
    width: 160px;
    height: 24px;
  }
`

export const DescriptionSkeletonLoader = styled(SkeletonLoader)`
  width: 256px;
  height: 20px;
`

export const DateText = styled(Text)`
  text-align: end;
`
