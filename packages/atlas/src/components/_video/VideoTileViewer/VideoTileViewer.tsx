import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionLinkUrl, SvgIllustrativePlay } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { VideoTile } from '../VideoTile'
import { VideoDetailsVariant } from '../VideoTileDetails'

type VideoTileViewerProps = {
  id?: string
  onClick?: () => void
  onChannelClick?: () => void
  detailsVariant?: VideoDetailsVariant
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export const VideoTileViewer: FC<VideoTileViewerProps> = ({
  id,
  onClick,
  detailsVariant,
  direction,
  className,
  onChannelClick,
}) => {
  const navigate = useNavigate()
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { copyToClipboard } = useClipboard()

  const { avatarPhotoUrls, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrls, videoHref } =
    useVideoTileSharedLogic(video)

  const channelHref = absoluteRoutes.viewer.channel(video?.channel.id)

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '', 'Video URL copied to clipboard')
  }, [videoHref, copyToClipboard])

  const contextMenuItems = [
    {
      nodeStart: <SvgActionLinkUrl />,
      onClick: handleCopyVideoURLClick,
      label: 'Copy video URL',
    },
  ]

  return (
    <VideoTile
      className={className}
      onClick={onClick}
      detailsVariant={detailsVariant}
      videoHref={videoHref}
      channelHref={channelHref}
      onChannelAvatarClick={() => {
        navigate(channelHref)
        onChannelClick?.()
      }}
      loadingDetails={loading || !video}
      loadingThumbnail={isLoadingThumbnail}
      thumbnailUrls={thumbnailPhotoUrls}
      views={video?.viewsNum}
      createdAt={video?.createdAt}
      slots={{
        bottomRight: {
          element: video?.duration ? (
            <Pill variant="overlay" label={formatDurationShort(video?.duration)} title="Video duration" />
          ) : null,
        },
        bottomLeft:
          video && video?.nft
            ? {
                element: <Pill label="NFT" variant="overlay" title="NFT" />,
              }
            : undefined,
        center: {
          element: <SvgIllustrativePlay />,
          type: 'hover',
        },
      }}
      channelAvatarUrls={avatarPhotoUrls}
      loadingAvatar={isLoadingAvatar}
      channelTitle={video?.channel?.title}
      videoTitle={video?.title}
      kebabMenuItems={contextMenuItems}
      direction={direction}
    />
  )
}
