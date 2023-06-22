import { FC, memo, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { VideoTileContainer } from './VideoTile.styles'

import { VideoThumbnail, VideoThumbnailProps } from '../VideoThumbnail'
import { VideoDetailsVariant, VideoTileDetails, VideoTileDetailsProps } from '../VideoTileDetails'

const SMALL_SIZE_WIDTH = 300

export type VideoTileProps = {
  direction?: 'vertical' | 'horizontal'
  detailsVariant?: VideoDetailsVariant
  className?: string
  loadingDetails?: boolean
  loadingThumbnail?: boolean
  playlistUrl?: string
} & Omit<VideoThumbnailProps, 'loading' | 'thumbnailAlt' | 'type'> &
  Omit<VideoTileDetailsProps, 'loading' | 'onVideoTitleClick' | 'variant' | 'size'>

export const VideoTile: FC<VideoTileProps> = memo(
  ({
    direction = 'vertical',
    detailsVariant,
    className,
    clickable,
    contentSlot,
    videoTitle,
    videoSubTitle,
    channelTitle,
    channelHref,
    onChannelAvatarClick,
    kebabMenuItems,
    onClick,
    slots,
    videoHref,
    linkState,
    thumbnailUrls,
    loadingDetails,
    channelAvatarUrls,
    createdAt,
    views,
    loadingThumbnail,
    loadingAvatar,
    type = 'video',
    playlistUrl,
  }) => {
    const [tileSize, setTileSize] = useState<'small' | 'medium'>()
    const { ref: thumbnailRef } = useResizeObserver<HTMLAnchorElement>({
      onResize: (size) => {
        const { width: videoTileWidth } = size
        if (videoTileWidth) {
          if (tileSize !== 'small' && videoTileWidth < SMALL_SIZE_WIDTH) {
            setTileSize('small')
          }
          if (tileSize !== 'medium' && videoTileWidth >= SMALL_SIZE_WIDTH) {
            setTileSize('medium')
          }
        }
      },
    })

    return (
      <VideoTileContainer direction={direction} className={className}>
        <VideoThumbnail
          type="video"
          ref={thumbnailRef}
          videoHref={videoHref}
          linkState={linkState}
          thumbnailUrls={thumbnailUrls}
          loading={loadingThumbnail}
          contentSlot={contentSlot}
          slots={slots}
          clickable={clickable}
          onClick={onClick}
          thumbnailAlt={videoTitle && `${videoTitle} by ${channelTitle} thumbnail`}
        />
        <VideoTileDetails
          onVideoTitleClick={onClick}
          size={tileSize}
          videoHref={videoHref}
          linkState={linkState}
          channelHref={channelHref}
          onChannelAvatarClick={onChannelAvatarClick}
          variant={detailsVariant}
          channelAvatarUrls={channelAvatarUrls}
          videoTitle={videoTitle}
          videoSubTitle={videoSubTitle}
          views={views}
          createdAt={createdAt}
          channelTitle={channelTitle}
          loading={loadingDetails}
          loadingAvatar={loadingAvatar}
          kebabMenuItems={kebabMenuItems}
          type={type}
          playlistUrl={playlistUrl}
        />
      </VideoTileContainer>
    )
  }
)

VideoTile.displayName = 'VideoTile'
