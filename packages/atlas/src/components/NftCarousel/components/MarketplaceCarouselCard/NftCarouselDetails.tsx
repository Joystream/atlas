import BN from 'bn.js'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { getNftStatus } from '@/api/hooks/nfts'
import { GetFeaturedNftsQuery } from '@/api/queries/__generated__/nfts.generated'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import {
  Container,
  DetailsContainer,
  InformationContainer,
  StatsContainer,
  VideoContainer,
} from '@/components/NftCarousel/components/MarketplaceCarouselCard/MarketplaceCarouselCard.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DetailsContent } from '@/components/_nft/NftTile'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useAsset, useMemberAvatar } from '@/providers/assets/assets.hooks'
import { transitions } from '@/styles'

export const NftCarouselDetails = ({
  nft,
  active,
}: {
  nft: GetFeaturedNftsQuery['ownedNfts'][number]
  active: boolean
}) => {
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
  const nftDetails = {
    buyNow:
      nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
        ? nftStatus.buyNowPrice
          ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
          : undefined
        : undefined,
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

  if (isLoading) {
    return (
      <VideoContainer>
        <SkeletonLoader height="100%" width="100%" />
      </VideoContainer>
    )
  }

  return (
    <Container isActive={active}>
      <VideoContainer>
        <BackgroundVideoPlayer
          autoPlay={active}
          playing={active}
          muted={true}
          onPause={(e) => (e.currentTarget.currentTime = 0)}
          preload="auto"
          src={mediaUrl ?? undefined}
          poster={thumbnailUrl ?? undefined}
          handleActions={active}
        />
      </VideoContainer>
      {active && (
        <CSSTransition in={active} timeout={100} classNames={transitions.names.fade} unmountOnExit>
          <InformationContainer>
            <DetailsContainer>
              <AvatarGroup
                avatarStrokeColor="transparent"
                avatars={[
                  {
                    url: nftDetails.creator?.assetUrl,
                    tooltipText: `Creator: ${nftDetails.creator?.name}`,
                    onClick: nftDetails.creator?.onClick,
                    loading: nftDetails.creator?.loading,
                  },
                  ...(owner
                    ? [
                        {
                          url: owner?.assetUrl,
                          tooltipText: `Owner: ${owner?.name}`,
                          onClick: owner?.onClick,
                        },
                      ]
                    : []),
                ]}
              />
              <Text variant="h500" as="p">
                {nftDetails.title}
              </Text>
              <StatsContainer>
                {nftDetails.buyNow && (
                  <DetailsContent
                    tileSize="big"
                    caption="BUY NOW"
                    content={nftDetails.buyNow}
                    icon={<JoyTokenIcon size={16} variant="regular" />}
                  />
                )}
                {nftDetails.topBid && (
                  <DetailsContent
                    tileSize="big"
                    caption="TOP BID"
                    content={nftDetails.topBid}
                    icon={<JoyTokenIcon size={16} variant="regular" />}
                  />
                )}
                <div>{nftDetails.endsAt?.toLocaleString()}</div>
              </StatsContainer>
            </DetailsContainer>
          </InformationContainer>
        </CSSTransition>
      )}
    </Container>
  )
}
