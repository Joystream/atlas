import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'

import { SkeletonTextWrapper, Wrapper } from './VideoListItem.styles'

export const VideoListItemLoader = ({ variant }: { variant: 'small' | 'large' }) => {
  return (
    <Wrapper variant={variant}>
      <SkeletonLoader height="100%" width={90} />
      <SkeletonTextWrapper>
        <SkeletonLoader height={sizes(4)} width="40%" />
        <SkeletonLoader height={sizes(4)} width="25%" />
      </SkeletonTextWrapper>
    </Wrapper>
  )
}
