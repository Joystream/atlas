import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { Pill } from '@/components/Pill'
import { SvgActionCopy, SvgIllustrativePlay } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { copyToClipboard } from '@/utils/browser'
import { formatDurationShort } from '@/utils/time'

import { VideoTile } from '../VideoTile'
import { VideoDetailsVariant } from '../VideoTileDetails'

type VideoTileViewerProps = {
  id?: string
  onClick?: () => void
  detailsVariant?: VideoDetailsVariant
}

export const VideoTileViewer: React.FC<VideoTileViewerProps> = ({ id, onClick, detailsVariant }) => {
  const navigate = useNavigate()
  const { avatarPhotoUrl, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrl, loading, video, videoHref } =
    useVideoTileSharedLogic({
      id,
    })

  const handleCopyVideoURLClick = useCallback(() => {
    copyToClipboard(videoHref ? location.origin + videoHref : '')
  }, [videoHref])

  return (
    <VideoTile
      onClick={onClick}
      detailsVariant={detailsVariant}
      videoHref={videoHref}
      channelHref={absoluteRoutes.viewer.channel(video?.category?.id)}
      onChannelAvatarClick={() => navigate(absoluteRoutes.viewer.channel(video?.category?.id))}
      loadingDetails={loading}
      channelId={video?.channel?.id}
      thumbnailUrl={thumbnailPhotoUrl}
      loadingThumbnail={isLoadingThumbnail}
      views={video?.views}
      createdAt={video?.createdAt}
      slots={{
        bottomRight: {
          element: video?.duration && <Pill variant="overlay" label={formatDurationShort(video?.duration)} />,
        },
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
    />
  )
}
