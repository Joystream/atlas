import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useBasicVideo } from '@/api/hooks'
import { Pill } from '@/components/Pill'
import { SvgActionCopy, SvgIllustrativePlay } from '@/components/_icons'
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
  detailsVariant?: VideoDetailsVariant
  direction?: 'vertical' | 'horizontal'
}

export const VideoTileViewer: FC<VideoTileViewerProps> = ({ id, onClick, detailsVariant, direction }) => {
  const { copyToClipboard } = useClipboard()
  const navigate = useNavigate()
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { avatarPhotoUrl, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrl, videoHref } =
    useVideoTileSharedLogic(video)

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '', 'Video URL copied to clipboard')
  }, [videoHref, copyToClipboard])

  const channelHref = absoluteRoutes.viewer.channel(video?.channel.id)

  return (
    <VideoTile
      onClick={onClick}
      detailsVariant={detailsVariant}
      videoHref={videoHref}
      channelHref={channelHref}
      onChannelAvatarClick={() => navigate(channelHref)}
      loadingDetails={loading || !video}
      loadingThumbnail={isLoadingThumbnail}
      thumbnailUrl={thumbnailPhotoUrl}
      views={video?.views}
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
      channelAvatarUrl={avatarPhotoUrl}
      loadingAvatar={isLoadingAvatar}
      channelTitle={video?.channel?.title}
      videoTitle={video?.title}
      kebabMenuItems={[
        {
          icon: <SvgActionCopy />,
          onClick: handleCopyVideoURLClick,
          title: 'Copy video URL',
        },
      ]}
      direction={direction}
    />
  )
}
