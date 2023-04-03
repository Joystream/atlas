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
}

export const NftTileViewer: FC<NftTileViewerProps> = ({ nftId }) => {
  const { nftStatus, nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnailUrl = nft?.video.thumbnailPhoto?.resolvedUrl
  const nftActions = useNftActions()
  const creatorAvatarUrl = nft?.video.channel.avatarPhoto?.resolvedUrl
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

  const { url: ownerMemberAvatarUrl } = getMemberAvatar(ownerMember || null)

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
        assetUrl: creatorAvatarUrl || undefined,
        loading,
        onClick: () => navigate(absoluteRoutes.viewer.channel(ownerChannel.id)),
      }
    : ownerMember
    ? {
        name: ownerMember.handle,
        assetUrl: ownerMemberAvatarUrl,
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
      thumbnailUrl: thumbnailUrl,
      loading: loading,
      thumbnailAlt: `${nft?.video?.title} video thumbnail`,
      type: 'video',
    },
    owner,
    creator: {
      name: nft?.video.channel.title || undefined,
      loading: loading,
      assetUrl: creatorAvatarUrl,
      onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
    },
    contextMenuItems,
  }

  return (
    <NftTile
      {...nftCommonProps}
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
