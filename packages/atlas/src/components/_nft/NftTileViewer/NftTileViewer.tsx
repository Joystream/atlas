import BN from 'bn.js'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useNftTransactions } from '@/hooks/useNftTransactions'
import { useVideoContextMenu } from '@/hooks/useVideoContextMenu'
import { useAsset, useMemberAvatar } from '@/providers/assets'
import { useNftActions } from '@/providers/nftActions'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: FC<NftTileViewerProps> = ({ nftId }) => {
  const { nftStatus, nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)
  const nftActions = useNftActions()
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const nftState = useNftState(nft)
  const { auctionPlannedEndDate, needsSettling, startsAtDate, englishTimerState, timerLoading } = nftState
  const { withdrawBid } = useNftTransactions()

  const { url: ownerMemberAvatarUrl } = useMemberAvatar(nft?.ownerMember)

  const isAuction = nftStatus?.status === 'auction'

  const handleWithdrawBid = () => {
    if (!nftState?.userBid?.amount || !nftState.userBidCreatedAt || !nftId) {
      return
    }
    withdrawBid(nftId, new BN(nftState.userBid.amount), nftState.userBidCreatedAt)
  }

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
      thumbnailUrl: thumbnail.url,
      loading: thumbnail.isLoadingAsset,
      thumbnailAlt: `${nft?.video?.title} video thumbnail`,
      type: 'video',
    },
    owner: nft?.ownerMember?.id
      ? {
          name: nft?.ownerMember?.handle,
          assetUrl: ownerMemberAvatarUrl,
          loading,
          onClick: () => navigate(absoluteRoutes.viewer.member(nft?.ownerMember?.handle)),
        }
      : undefined,
    creator: {
      name: nft?.video.channel.title || undefined,
      loading: creatorAvatar.isLoadingAsset || loading,
      assetUrl: creatorAvatar.url,
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
