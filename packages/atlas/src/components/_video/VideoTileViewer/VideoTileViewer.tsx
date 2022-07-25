import { FC } from 'react'
import { useNavigate } from 'react-router'

import { useFullVideo } from '@/api/hooks'
import { Pill } from '@/components/Pill'
import { SvgIllustrativePlay } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useVideoContextMenu } from '@/hooks/useVideoContextMenu'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { useNftActions } from '@/providers/nftActions'
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
  const navigate = useNavigate()
  const { video, loading } = useFullVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { avatarPhotoUrl, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrl, videoHref } =
    useVideoTileSharedLogic(video)

  const channelHref = absoluteRoutes.viewer.channel(video?.channel.id)
  const nftState = useNftState(video?.nft)
  const nftActions = useNftActions()
  const { withdrawBid } = useNftTransactions()
  const auction = video?.nft?.transactionalStatusAuction
  const contextMenuItems = useVideoContextMenu({
    publisher: false,
    nftState,
    hasNft: !!video?.nft,
    nftActions,
    videoId: video?.id,
    videoHref,
    topBid: auction?.topBid?.amount ? Number(auction?.topBid?.amount) : undefined,
    buyNowPrice: auction?.buyNowPrice ? Number(auction?.buyNowPrice) : undefined,
    startingPrice: auction?.startingPrice ? Number(auction?.startingPrice) : undefined,
    onWithdrawBid: () => video?.id && withdrawBid(video?.id),
    hasBids:
      !!auction && !!auction.topBid?.bidder && !!(auction && !auction.topBid?.isCanceled && auction.topBid.amount),
  })

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
      kebabMenuItems={contextMenuItems}
      direction={direction}
    />
  )
}
