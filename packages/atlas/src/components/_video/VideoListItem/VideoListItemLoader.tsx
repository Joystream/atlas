import { FC } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { sizes } from '@/styles'

import { StyledListItem, VideoListItemVariants, getVideoVariantDimensions } from './VideoListItem.styles'

export const VideoListItemLoader: FC<{ variant?: VideoListItemVariants; className?: string }> = ({
  className,
  variant = 'small',
}) => {
  const xsMatch = useMediaMatch('xs')
  return (
    <StyledListItem
      isInteractive={false}
      className={className}
      captionClassName="li-caption"
      label={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 100 : 151} />}
      caption={<SkeletonLoader height={sizes(4)} width={variant === 'small' ? 50 : 111} />}
      nodeStart={
        <SkeletonLoader
          height={getVideoVariantDimensions(variant).height}
          // width="100%"
          width={!xsMatch ? '100%' : getVideoVariantDimensions(variant).width}
        />
      }
      ignoreRWD={variant !== 'large'}
    />
  )
}
