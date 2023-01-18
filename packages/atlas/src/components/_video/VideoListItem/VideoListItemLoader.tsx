import { FC } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { sizes } from '@/styles'

import { StyledListItem, VideoListItemVariants, getVideoVaraintDimensions } from './VideoListItem.styles'

export const VideoListItemLoader: FC<{ variant?: VideoListItemVariants }> = ({ variant = 'small' }) => {
  return (
    <StyledListItem
      isInteractive={false}
      label={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 100 : 151} />}
      caption={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 50 : 111} />}
      nodeStart={
        <SkeletonLoader
          height={getVideoVaraintDimensions(variant).height}
          width={getVideoVaraintDimensions(variant).width}
        />
      }
      ignoreRWD={variant !== 'large'}
    />
  )
}
