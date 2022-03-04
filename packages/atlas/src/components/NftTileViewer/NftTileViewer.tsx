import React from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { AllNftFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useAsset } from '@/providers/assets'
import { useJoystream } from '@/providers/joystream'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  const { nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)

  const { getCurrentBlock } = useJoystream()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const msTimestamp = useMsTimestamp()

  const getNftProps = (nft?: AllNftFieldsFragment): NftTileProps => {
    const nftCommonProps = {
      title: nft?.video?.title,
      duration: nft?.video?.duration,
      views: nft?.video?.views,
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
        return {
          ...nftCommonProps,
          auction: 'none',
        }
      case 'TransactionalStatusBuyNow':
        return {
          ...nftCommonProps,
          auction: 'none',
          buyNowPrice: nft.transactionalStatus.price,
        }
      case 'TransactionalStatusAuction': {
        const auctionPlannedEndBlock = nft.transactionalStatus.auction?.plannedEndAtBlock || undefined
        const isEnded = auctionPlannedEndBlock && getCurrentBlock() >= auctionPlannedEndBlock
        const plannedEndMsTimestamp =
          !isEnded && !!auctionPlannedEndBlock && convertBlockToMsTimestamp(auctionPlannedEndBlock)

        return {
          ...nftCommonProps,
          auction: isEnded ? 'none' : nft.transactionalStatus.auction?.lastBid?.amount ? 'topBid' : 'minBid',
          buyNowPrice: isEnded ? undefined : nft.transactionalStatus.auction?.buyNowPrice,
          minBid: nft.transactionalStatus.auction?.startingPrice,
          topBid: nft.transactionalStatus.auction?.lastBid?.amount,
          timeLeftMs: plannedEndMsTimestamp ? plannedEndMsTimestamp - msTimestamp : undefined,
        }
      }
      default:
        return {
          ...nftCommonProps,
          auction: 'none',
        }
    }
  }
  return <NftTile {...getNftProps(nft)} role="viewer" fullWidth />
}
