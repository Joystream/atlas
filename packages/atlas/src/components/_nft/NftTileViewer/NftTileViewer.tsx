import React from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useNftState } from '@/hooks/useNftState'
import { useAsset, useMemberAvatar } from '@/providers/assets'
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
    canChangePrice,
    auctionPlannedEndDate,
    needsSettling,
    startsAtDate,
    englishTimerState,
    timerLoading,
    saleType,
  } = useNftState(nft)

  const { cancelNftSale, openNftPutOnSale } = useNftActions()
  const { url: ownerMemberAvatarUrl } = useMemberAvatar(nft?.ownerMember)

  const handleRemoveOnSale = () => {
    if (!nftId || !saleType) {
      return
    }
    cancelNftSale(nftId, saleType)
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
      needsSettling={needsSettling}
      startsAtDate={startsAtDate}
      englishTimerState={englishTimerState}
      canPutOnSale={canPutOnSale}
      canBuyNow={canBuyNow}
      canCancelSale={canCancelSale}
      canMakeBid={canMakeBid}
      canChangePrice={canChangePrice}
      fullWidth
      onRemoveFromSale={handleRemoveOnSale}
      onNftPurchase={() => nftId && openNftPurchase(nftId)}
      onNftBuyNow={() => nftId && openNftPurchase(nftId, { fixedPrice: true })}
      onPutOnSale={handlePutOnSale}
      onChangePrice={() => nftId && openNftChangePrice(nftId)}
    />
  )
}
