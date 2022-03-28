import React from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useAsset } from '@/providers/assets'
import { useNftActions } from '@/providers/nftActions'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  // TODO remove fetch policy once QN bug with not fetching auctions in video query is resolved
  const { nftStatus, nft, loading } = useNft(nftId || '', { fetchPolicy: 'network-only' })
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)
  const { openNftPurchase, openNftChangePrice } = useNftActions()
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const {
    canPutOnSale,
    canMakeBid,
    canCancelSale,
    canBuyNow,
    isBuyNow,
    auctionPlannedEndDate,
    needsSettling,
    startsAtDate,
    englishTimerState,
    timerLoading,
  } = useNftState(nft)

  const { cancelNftSale, openNftPutOnSale } = useNftActions()

  const handleRemoveOnSale = () => {
    if (!nftId || !nft?.video.id) {
      return
    }
    cancelNftSale(nftId, !!isBuyNow)
  }

  const handlePutOnSale = () => {
    if (!nftId) {
      return
    }
    openNftPutOnSale(nftId)
  }

  const nftCommonProps: NftTileProps = {
    ...nftStatus,
    loading: loading || !nftId,
    thumbnail: {
      videoHref: absoluteRoutes.viewer.video(nft?.video.id),
      thumbnailUrl: thumbnail.url,
      loading: thumbnail.isLoadingAsset,
      thumbnailAlt: `${nft?.video?.title} video thumbnail`,
    },
    owner: nft?.ownerMember?.id
      ? {
          name: nft?.ownerMember?.handle,
          assetUrl:
            nft?.ownerMember?.metadata.avatar?.__typename === 'AvatarUri'
              ? nft.ownerMember?.metadata.avatar.avatarUri
              : '',
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
  }

  const buyNowPrice =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction'
      ? nft.transactionalStatus.auction?.buyNowPrice
      : undefined
  const topBidAmount =
    nft?.transactionalStatus.__typename === 'TransactionalStatusAuction'
      ? nft.transactionalStatus.auction?.lastBid?.amount
      : undefined
  return (
    <NftTile
      {...nftCommonProps}
      timerLoading={timerLoading}
      buyNowPrice={Number(buyNowPrice)}
      topBid={Number(topBidAmount)}
      auctionPlannedEndDate={auctionPlannedEndDate}
      needsSettling={needsSettling}
      startsAtDate={startsAtDate}
      englishTimerState={englishTimerState}
      canPutOnSale={canPutOnSale}
      canBuyNow={canBuyNow}
      canCancelSale={canCancelSale}
      canMakeBid={canMakeBid}
      fullWidth
      onRemoveFromSale={handleRemoveOnSale}
      onNftPurchase={() => nftId && openNftPurchase(nftId)}
      onNftBuyNow={() => nftId && openNftPurchase(nftId, { fixedPrice: true })}
      onPutOnSale={handlePutOnSale}
      onNftChangePrice={() => nftId && openNftChangePrice(nftId)}
    />
  )
}
