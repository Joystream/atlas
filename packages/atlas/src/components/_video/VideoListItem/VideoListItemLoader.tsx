import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { sizes } from '@/styles'

import { SkeletonTextWrapper, Wrapper } from './VideoListItem.styles'

export const VideoListItemLoader = ({ variant }: { variant: 'small' | 'large' }) => {
  const xsMatch = useMediaMatch('xs')
  return (
    <Wrapper variant={variant}>
      <SkeletonLoader height="100%" width={!xsMatch ? 250 : variant === 'small' ? 88 : 197} />
      <SkeletonTextWrapper variant={variant}>
        <SkeletonLoader height={sizes(4)} width="40%" />
        <SkeletonLoader height={sizes(4)} width="25%" />
      </SkeletonTextWrapper>
    </Wrapper>
  )
}
