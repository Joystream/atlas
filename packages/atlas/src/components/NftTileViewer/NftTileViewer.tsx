import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useNft } from '@/api/hooks'
import { AllNftFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useAsset } from '@/providers/assets'

import { NftTile, NftTileProps } from '../NftTile'

type NftTileViewerProps = {
  nftId?: string
}

export const NftTileViewer: React.FC<NftTileViewerProps> = ({ nftId }) => {
  const { nft, loading } = useNft(nftId || '')
  const navigate = useNavigate()
  const thumbnail = useAsset(nft?.video.thumbnailPhoto)
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const { convertBlockToDate, convertDateToBlock } = useBlockTimeEstimation()

  const [timeleft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (
      nft?.transactionalStatus.__typename !== 'TransactionalStatusAuction' ||
      !nft?.transactionalStatus.auction?.plannedEndAtBlock
    ) {
      return
    }

    const timeLeftInterval = setInterval(() => {
      if (
        nft?.transactionalStatus.__typename === 'TransactionalStatusAuction' &&
        nft.transactionalStatus.auction?.plannedEndAtBlock
      ) {
        const timeleft = Math.round(
          (convertBlockToDate(nft.transactionalStatus.auction?.plannedEndAtBlock) - Date.now()) / 1000
        )
        if (timeleft >= 0) {
          setTimeLeft(timeleft)
        }
      }
    }, 1000)
    return () => {
      clearInterval(timeLeftInterval)
    }
  }, [convertBlockToDate, nft?.transactionalStatus.__typename, nft?.transactionalStatus, timeleft, convertDateToBlock])

  const getNftProps = (nft?: AllNftFieldsFragment): NftTileProps => {
    const nftCommponProps = {
      title: nft?.video?.title,
      duration: nft?.video?.duration,
      views: nft?.video?.views,
      loading,
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
          ...nftCommponProps,
          auction: 'none',
        }
      case 'TransactionalStatusBuyNow':
        return {
          ...nftCommponProps,
          auction: 'none',
          buyNowPrice: nft.transactionalStatus.price,
        }
      case 'TransactionalStatusAuction': {
        const isEnded = nft.transactionalStatus.auction?.endedAtBlock || timeleft <= 0
        return {
          ...nftCommponProps,
          auction: isEnded ? 'none' : nft.transactionalStatus.auction?.lastBid?.amount ? 'topBid' : 'minBid',
          buyNowPrice: isEnded ? undefined : nft.transactionalStatus.auction?.buyNowPrice,
          minBid: nft.transactionalStatus.auction?.startingPrice,
          topBid: nft.transactionalStatus.auction?.lastBid?.amount,
          timeleft,
        }
      }
      default:
        return {
          ...nftCommponProps,
          auction: 'none',
        }
    }
  }
  return <NftTile {...getNftProps(nft)} role="viewer" />
}
