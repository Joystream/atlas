import { FC } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'

import { SkeletonTextWrapper, Wrapper } from './VideoListItem.styles'

export const VideoListItemLoader: FC<{ variant: 'small' | 'large' }> = ({ variant }) => {
  return (
    <Wrapper variant={variant}>
      <SkeletonLoader height={variant === 'small' ? 50 : 111} width={90} />
      <SkeletonTextWrapper>
        <SkeletonLoader height={sizes(4)} width="40%" />
        <SkeletonLoader height={sizes(4)} width="25%" />
      </SkeletonTextWrapper>
    </Wrapper>
  )
}
