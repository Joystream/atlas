import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { Pill } from '@/components/Pill'
import { SvgActionCopy, SvgIllustrativePlay } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useGetNftSlot } from '@/hooks/useGetNftSlot'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { formatDurationShort } from '@/utils/time'

import { VideoTile } from '../VideoTile'
import { VideoDetailsVariant } from '../VideoTileDetails'

type VideoTileViewerProps = {
  id?: string
  onClick?: () => void
  detailsVariant?: VideoDetailsVariant
  direction?: 'vertical' | 'horizontal'
}

export const VideoTileViewer: React.FC<VideoTileViewerProps> = ({ id, onClick, detailsVariant, direction }) => {
  const { copyToClipboard } = useClipboard()
  const navigate = useNavigate()
  const { avatarPhotoUrl, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrl, loading, video, videoHref } =
    useVideoTileSharedLogic({
      id,
    })
  const nftBottomLeftSlot = useGetNftSlot(id)

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
      loadingDetails={loading}
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
        bottomLeft: nftBottomLeftSlot,
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
