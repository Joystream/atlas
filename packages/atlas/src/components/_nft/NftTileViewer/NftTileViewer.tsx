import { FC } from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks/nfts'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useVideoContextMenu } from '@/hooks/useVideoContextMenu'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
  isInCarousel?: boolean
}

export const NftTileViewer: FC<NftTileViewerProps> = ({ nftId, isInCarousel }) => {
  const { nftStatus, nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnailUrls = nft?.video.thumbnailPhoto?.resolvedUrls
  const nftActions = useNftActions()
  const creatorAvatarUrls = nft?.video.channel.avatarPhoto?.resolvedUrls
  const nftState = useNftState(nft)
  const {
    auctionPlannedEndDate,
    needsSettling,
    startsAtDate,
    englishTimerState,
    timerLoading,
    userBidCreatedAt,
    userBidAmount,
  } = nftState
  const { withdrawBid } = useNftTransactions()
  const ownerMember = nft?.owner.__typename === 'NftOwnerMember' && nft.owner.member
  const ownerChannel = nft?.owner.__typename === 'NftOwnerChannel' && nft.owner.channel

  const { urls: ownerMemberAvatarUrls } = getMemberAvatar(ownerMember || null)

  const isAuction = nftStatus?.status === 'auction'

  const handleWithdrawBid = () => {
    if (!nftId || !userBidCreatedAt || !userBidAmount) {
      return
    }
    withdrawBid(nftId, userBidAmount, userBidCreatedAt)
  }

  const owner = ownerChannel
    ? {
        name: ownerChannel.title || undefined,
        assetUrls: creatorAvatarUrls || undefined,
        loading,
        onClick: () => navigate(absoluteRoutes.viewer.channel(ownerChannel.id)),
      }
    : ownerMember
    ? {
        name: ownerMember.handle,
        assetUrls: ownerMemberAvatarUrls,
        loading,
        onClick: () => navigate(absoluteRoutes.viewer.member(ownerMember.handle)),
      }
    : undefined

  const contextMenuItems = useVideoContextMenu({
    publisher: false,
    nftState,
    hasNft: true,
    nftActions,
    videoId: nftId,
    videoHref: absoluteRoutes.viewer.video(nftId),
    topBid: isAuction ? nftStatus.topBidAmount : undefined,
    buyNowPrice: isAuction || nftStatus?.status === 'buy-now' ? nftStatus.buyNowPrice : undefined,
    startingPrice: isAuction ? nftStatus.startingPrice : undefined,
    onWithdrawBid: handleWithdrawBid,
    hasBids:
      isAuction && !!nftStatus.topBidder && !!(isAuction && !nftStatus.topBid?.isCanceled && nftStatus.topBidAmount),
  })

  const nftCommonProps: NftTileProps = {
    ...nftStatus,
    loading: loading || !nftId,
    thumbnail: {
      videoHref: absoluteRoutes.viewer.video(nft?.video.id),
      thumbnailUrls: thumbnailUrls,
      loading: loading,
      thumbnailAlt: `${nft?.video?.title} video thumbnail`,
      type: 'video',
    },
    owner,
    creator: {
      name: nft?.video.channel.title || undefined,
      loading: loading,
      assetUrls: creatorAvatarUrls,
      onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
    },
    contextMenuItems,
  }

  return (
    <NftTile
      {...nftCommonProps}
      isInCarousel={isInCarousel}
      timerLoading={timerLoading}
      buyNowPrice={
        nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now' ? nftStatus.buyNowPrice : undefined
      }
      topBidAmount={nftStatus?.status === 'auction' ? nftStatus.topBidAmount : undefined}
      auctionPlannedEndDate={auctionPlannedEndDate}
      startsAtDate={startsAtDate}
      englishTimerState={englishTimerState}
      needsSettling={needsSettling}
      fullWidth
    />
  )
}
