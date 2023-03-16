import { useNavigate } from 'react-router'

import { getNftStatus } from '@/api/hooks/nfts'
import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { NftTileDetailsProps } from '@/components/_nft/NftTile'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useAsset, useMemberAvatar } from '@/providers/assets/assets.hooks'

import { Container, InformationContainer, VideoContainer } from './MarketplaceCarouselCard.styles'

type CrtCard = {
  type: 'crt'
}

type NftCard = {
  type: 'nft'
  nft: GetFeaturedNftsQuery['ownedNfts'][number]
}

type CardTypes = NftCard | CrtCard

type MarketplaceCarouselCardProps = {
  active: boolean
} & CardTypes

export const MarketplaceCarouselCard = (props: MarketplaceCarouselCardProps) => {
  const informations = () => {
    if (props.type === 'nft') {
      // console.log('card', props.active, props.nft.id)

      return <NftDetails {...props} />
    }

    return null
  }
  return informations()
}

const NftDetails = ({ nft, active }: { nft: NftCard['nft']; active: boolean }) => {
  const navigate = useNavigate()
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const { url: thumbnailUrl } = useAsset(nft?.video.thumbnailPhoto)

  const { url: mediaUrl } = useAsset(nft.video.media)

  // const nftState = useNftState(nft)
  // const {
  //   auctionPlannedEndDate,
  //   needsSettling,
  //   startsAtDate,
  //   englishTimerState,
  //   timerLoading,
  //   userBidCreatedAt,
  //   userBidAmount,
  // } = nftState

  const { url: ownerMemberAvatarUrl } = useMemberAvatar(nft?.ownerMember)

  const owner = nft?.isOwnedByChannel
    ? {
        name: nft.creatorChannel.title || undefined,
        assetUrl: creatorAvatar.url || undefined,
        onClick: () => navigate(absoluteRoutes.viewer.channel(nft.creatorChannel.id)),
      }
    : nft?.ownerMember?.id
    ? {
        name: nft?.ownerMember?.handle,
        assetUrl: ownerMemberAvatarUrl,
        onClick: () => navigate(absoluteRoutes.viewer.member(nft?.ownerMember?.handle)),
      }
    : undefined
  const nftStatus = getNftStatus(nft, nft?.video)
  const nftCommonProps: NftTileDetailsProps = {
    // ...nftStatus,
    buyNowPrice:
      nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
        ? nftStatus.buyNowPrice
          ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
          : undefined
        : undefined,
    startingPrice:
      nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
        ? nftStatus.buyNowPrice
          ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
          : undefined
        : undefined,
    loading: !nft?.id,
    owner,
    creator: {
      name: nft?.video.channel.title || undefined,
      loading: creatorAvatar.isLoadingAsset,
      assetUrl: creatorAvatar.url,
      onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
    },
    title: nft.video.title,
  }

  return (
    <Container>
      <VideoContainer>
        <BackgroundVideoPlayer
          muted={true}
          autoPlay={active}
          playing={active}
          onPause={(e) => (e.currentTarget.currentTime = 0)}
          preload="metadata"
          src={mediaUrl ?? undefined}
          poster={thumbnailUrl ?? undefined}
        />
      </VideoContainer>
      <InformationContainer />
      {/*{active && <NftTileDetails {...nftCommonProps} />}*/}
    </Container>
  )
}
