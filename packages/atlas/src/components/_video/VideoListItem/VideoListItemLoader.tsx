import { FC } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'

import { StyledListItem } from './VideoListItem.styles'

export const VideoListItemLoader: FC<{ variant: 'small' | 'large' }> = ({ variant }) => {
  return (
    <StyledListItem
      isInteractive={false}
      label={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 100 : 151} />}
      caption={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 50 : 111} />}
      nodeStart={<SkeletonLoader height={variant === 'small' ? 50 : 111} width={variant === 'small' ? 80 : 190} />}
      ignoreRWD={variant === 'small'}
    />
  )
}
