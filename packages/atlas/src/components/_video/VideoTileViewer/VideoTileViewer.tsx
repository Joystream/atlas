import { FC } from 'react'
import { useNavigate } from 'react-router'

import { getNftStatus } from '@/api/hooks/nfts'
import { useBasicVideo } from '@/api/hooks/video'
import { SvgIllustrativePlay } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useVideoContextMenu } from '@/hooks/useVideoContextMenu'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'
import { SentryLogger } from '@/utils/logs'
import { formatDurationShort } from '@/utils/time'

import { VideoTile } from '../VideoTile'
import { VideoDetailsVariant } from '../VideoTileDetails'

type VideoTileViewerProps = {
  id?: string
  onClick?: () => void
  detailsVariant?: VideoDetailsVariant
  direction?: 'vertical' | 'horizontal'
  className?: string
}

export const VideoTileViewer: FC<VideoTileViewerProps> = ({ id, onClick, detailsVariant, direction, className }) => {
  const navigate = useNavigate()
  const { video, loading } = useBasicVideo(id ?? '', {
    skip: !id,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const nftStatus = getNftStatus(video?.nft, video)
  const nftState = useNftState(video?.nft)
  const { avatarPhotoUrls, isLoadingAvatar, isLoadingThumbnail, thumbnailPhotoUrls, videoHref } =
    useVideoTileSharedLogic(video)

  const handleWithdrawBid = () => {
    if (!video?.id || !nftState.userBidAmount || !nftState.userBidCreatedAt) {
      return
    }
    withdrawBid(video?.id, nftState.userBidAmount, nftState.userBidCreatedAt)
  }

  const channelHref = absoluteRoutes.viewer.channel(video?.channel.id)
  const nftActions = useNftActions()
  const { withdrawBid } = useNftTransactions()
  const auction =
    video?.nft?.transactionalStatus?.__typename === 'TransactionalStatusAuction' &&
    video.nft.transactionalStatus.auction
  const isAuction = nftStatus?.status === 'auction'
  const contextMenuItems = useVideoContextMenu({
    publisher: false,
    nftState,
    hasNft: !!video?.nft,
    nftActions,
    videoId: video?.id,
    videoHref,
    buyNowPrice: isAuction || nftStatus?.status === 'buy-now' ? nftStatus.buyNowPrice : undefined,
    topBid: isAuction ? nftStatus.topBidAmount : undefined,
    startingPrice: isAuction ? nftStatus.startingPrice : undefined,
    onWithdrawBid: handleWithdrawBid,
    hasBids:
      !!auction && !!auction.topBid?.bidder && !!(auction && !auction.topBid?.isCanceled && auction.topBid.amount),
  })

  return (
    <VideoTile
      className={className}
      onClick={onClick}
      detailsVariant={detailsVariant}
      videoHref={videoHref}
      channelHref={channelHref}
      onChannelAvatarClick={() => navigate(channelHref)}
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
