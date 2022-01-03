import React from 'react'

import { VideoTileContainer } from './VideoTile.styles'

import { VideoThumbnail, VideoThumbnailProps } from '../VideoThumbnail'
import { VideoDetailsVariant, VideoTileDetails, VideoTileDetailsProps } from '../VideoTileDetails'

export type VideoTileProps = {
  direction?: 'vertical' | 'horizontal'
  detailsVariant?: VideoDetailsVariant
  className?: string
  loadingDetails?: boolean
  loadingThumbnail?: boolean
} & VideoThumbnailProps &
  VideoTileDetailsProps

export const VideoTile: React.FC<VideoTileProps> = React.memo(
  ({
    direction = 'vertical',
    detailsVariant,
    className,
    clickable,
    contentSlot,
    videoTitle,
    videoSubTitle,
    channelTitle,
    kebabMenuItems,
    onClick,
    size,
    slots,
    to,
    linkState,
    thumbnailUrl,
    loadingDetails,
    channelAvatarUrl,
    createdAt,
    views,
    loadingThumbnail,
    loadingAvatar,
  }) => {
    return (
      <VideoTileContainer direction={direction} className={className}>
        <VideoThumbnail
          to={to}
          linkState={linkState}
          thumbnailUrl={thumbnailUrl}
          loading={loadingThumbnail}
          contentSlot={contentSlot}
          slots={slots}
          clickable={clickable}
          onClick={onClick}
          thumbnailAlt={videoTitle && `${videoTitle} by ${channelTitle} thumbnail`}
        />
        <VideoTileDetails
          size={size}
          variant={detailsVariant}
          channelAvatarUrl={channelAvatarUrl}
          videoTitle={videoTitle}
          videoSubTitle={videoSubTitle}
          views={views}
          createdAt={createdAt}
          channelTitle={channelTitle}
          loading={loadingDetails}
          loadingAvatar={loadingAvatar}
          kebabMenuItems={kebabMenuItems}
        />
      </VideoTileContainer>
    )
  }
)

VideoTile.displayName = 'VideoTile'
