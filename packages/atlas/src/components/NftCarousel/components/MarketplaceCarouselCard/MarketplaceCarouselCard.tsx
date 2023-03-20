import BN from 'bn.js'
import { useNavigate } from 'react-router'

import { getNftStatus } from '@/api/hooks/nfts'
import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DetailsContent, Member } from '@/components/_nft/NftTile'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useAsset, useMemberAvatar } from '@/providers/assets/assets.hooks'

import {
  Container,
  DetailsContainer,
  InformationContainer,
  StatsContainer,
  VideoContainer,
} from './MarketplaceCarouselCard.styles'

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
      return <NftDetails {...props} />
    }

    return null
  }
  return informations()
}

const NftDetails = ({ nft, active }: { nft: NftCard['nft']; active: boolean }) => {
  const navigate = useNavigate()
  const creatorAvatar = useAsset(nft?.video.channel.avatarPhoto)
  const { url: thumbnailUrl, isLoadingAsset: isVideoLoading } = useAsset(nft?.video.thumbnailPhoto)
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const { url: mediaUrl, isLoadingAsset: isPosterLoading } = useAsset(nft.video.media)

  const isLoading = isPosterLoading || isVideoLoading

  const auction = nft?.transactionalStatusAuction || null
  const englishAuction = auction?.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
  const plannedEndDateBlockTimestamp = englishAuction && convertBlockToMsTimestamp(englishAuction.plannedEndAtBlock)
  const auctionPlannedEndDate = plannedEndDateBlockTimestamp ? new Date(plannedEndDateBlockTimestamp) : undefined

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
  const nftDetails: DetailsCardNft = {
    buyNow:
      nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
        ? nftStatus.buyNowPrice
          ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
          : undefined
        : undefined,
    owner,
    creator: {
      name: nft?.video.channel.title || undefined,
      loading: creatorAvatar.isLoadingAsset,
      assetUrl: creatorAvatar.url,
      onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
    },
    title: nft.video.title,
    type: 'nft',
    topBid: nft?.transactionalStatusAuction?.topBid?.amount
      ? hapiBnToTokenNumber(new BN(nft?.transactionalStatusAuction?.topBid?.amount))
      : undefined,
    endsAt: auctionPlannedEndDate,
  }

  return (
    <Container isActive={active}>
      <VideoContainer>
        {isLoading ? (
          <SkeletonLoader height={600} width="100%" />
        ) : (
          <BackgroundVideoPlayer
            autoPlay={active}
            playing={active}
            muted={true}
            onPause={(e) => (e.currentTarget.currentTime = 0)}
            preload="metadata"
            src={mediaUrl ?? undefined}
            poster={thumbnailUrl ?? undefined}
            handleActions={active}
          />
        )}
      </VideoContainer>
      {active && <InformationContainer>{active && <DetailsCard {...nftDetails} />}</InformationContainer>}
    </Container>
  )
}

type DetailsCardNft = {
  type: 'nft'
  buyNow?: number
  topBid?: number
  endsAt?: Date
  owner?: Member
  creator?: Member
  title?: string | null
}

type DetailsCardCrt = {
  type: 'crt'
  marketCap: string
  sale: Date
  tokensOnSale: number
  tokenTreshold: number

  description: string

  holdersCount: number
}

type DetailsCardProps = DetailsCardNft | DetailsCardCrt

const DetailsCard = (props: DetailsCardProps) => {
  if (props.type === 'nft') {
    const { buyNow, endsAt, topBid, owner, creator, title } = props
    return (
      <DetailsContainer>
        <AvatarGroup
          avatarStrokeColor="transparent"
          avatars={[
            {
              url: creator?.assetUrl,
              tooltipText: `Creator: ${creator?.name}`,
              onClick: creator?.onClick,
              loading: creator?.loading,
            },
            ...(owner
              ? [
                  {
                    url: owner?.assetUrl,
                    tooltipText: `Owner: ${owner?.name}`,
                    onClick: owner?.onClick,
                    loading: owner.loading,
                  },
                ]
              : []),
          ]}
        />
        <Text variant="h500" as="p">
          {title}
        </Text>
        <StatsContainer>
          {buyNow && (
            <DetailsContent
              tileSize="big"
              caption="BUY NOW"
              content={buyNow}
              icon={<JoyTokenIcon size={16} variant="regular" />}
            />
          )}
          {topBid && (
            <DetailsContent
              tileSize="big"
              caption="TOP BID"
              content={topBid}
              icon={<JoyTokenIcon size={16} variant="regular" />}
            />
          )}
          <div>{endsAt?.toLocaleString()}</div>
        </StatsContainer>
      </DetailsContainer>
    )
  }

  return null
}
