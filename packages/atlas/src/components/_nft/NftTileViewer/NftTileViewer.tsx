import React from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useNftState } from '@/hooks/useNftState'
import { useAsset } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  const { nftStatus, nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)
  const { openNftPurchase, openNftChangePrice } = useNftActions()
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const { canPutOnSale, canMakeBid, canCancelSale, canBuyNow, isBuyNow } = useNftState(nft)
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

  const { currentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const msTimestamp = useMsTimestamp()

  const getNftProps = (): NftTileProps => {
    const nftCommonProps = {
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
        name: nft?.video.channel.title,
        loading: creatorAvatar.isLoadingAsset || loading,
        assetUrl: creatorAvatar.url,
        onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
      },
    } as NftTileProps
    switch (nft?.transactionalStatus.__typename) {
      case 'TransactionalStatusIdle':
      case 'TransactionalStatusInitiatedOfferToMember':
      case 'TransactionalStatusBuyNow':
        return {
          ...nftCommonProps,
        }
      case 'TransactionalStatusAuction': {
        const auctionPlannedEndBlock = nftStatus?.status === 'auction' && nftStatus?.auctionPlannedEndBlock
        const isEnded = auctionPlannedEndBlock && currentBlock >= auctionPlannedEndBlock
        const plannedEndMsTimestamp =
          !isEnded && !!auctionPlannedEndBlock && convertBlockToMsTimestamp(auctionPlannedEndBlock)

        return {
          ...nftCommonProps,
          status: isEnded ? 'idle' : 'auction',
          buyNowPrice: isEnded ? undefined : Number(nft.transactionalStatus.auction?.buyNowPrice),
          startingPrice: Number(nft.transactionalStatus.auction?.startingPrice),
          topBid: Number(nft.transactionalStatus.auction?.lastBid?.amount),
          timeLeftMs: plannedEndMsTimestamp ? plannedEndMsTimestamp - msTimestamp : undefined,
        }
      }
      default:
        return {
          ...nftCommonProps,
        }
    }
  }
  return (
    <NftTile
      {...getNftProps()}
      fullWidth
      canPutOnSale={canPutOnSale}
      canBuyNow={canBuyNow}
      canCancelSale={canCancelSale}
      canMakeBid={canMakeBid}
      onRemoveFromSale={handleRemoveOnSale}
      onNftPurchase={() => nftId && openNftPurchase(nftId)}
      onNftBuyNow={() => nftId && openNftPurchase(nftId, { fixedPrice: true })}
      onPutOnSale={handlePutOnSale}
      onNftChangePrice={() => nftId && openNftChangePrice(nftId)}
    />
  )
}
