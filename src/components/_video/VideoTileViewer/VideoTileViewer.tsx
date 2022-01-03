import React, { useCallback } from 'react'

import { Pill } from '@/components/Pill'
import { SvgActionCopy, SvgIllustrativePlay } from '@/components/_icons'
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
      to={videoHref}
      loadingDetails={loading}
      thumbnailUrl={thumbnailPhotoUrl}
      loadingThumbnail={isLoadingThumbnail}
      views={video?.views}
      createdAt={video?.createdAt}
      slots={{
        bottomRight: {
          element: <Pill variant="overlay" label={formatDurationShort(video?.duration || 0)} />,
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
