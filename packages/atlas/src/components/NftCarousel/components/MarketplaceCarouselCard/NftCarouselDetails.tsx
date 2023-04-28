import BN from 'bn.js'
import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { getNftStatus } from '@/api/hooks/nfts'
import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'
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
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { transitions } from '@/styles'

export const NftCarouselDetails = ({
  nft,
  active,
  slideNext,
}: {
  nft: GetFeaturedNftsVideosQuery['ownedNfts'][number]
  active: boolean
  slideNext: () => void
}) => {
  const navigate = useNavigate()
  const creatorAvatarUrl =
    nft.owner.__typename === 'NftOwnerChannel'
      ? nft.owner.channel.avatarPhoto?.resolvedUrl
      : getMemberAvatar(nft.owner.member).url

  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const thumbnailUrl = nft.video.thumbnailPhoto?.resolvedUrl
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()

  const mediaUrl = nft.video.media?.resolvedUrl

  const isLoading = !thumbnailUrl || !mediaUrl

  const nftStatus = getNftStatus(nft, nft?.video)
  const plannedEndDateBlockTimestamp =
    nftStatus?.status === 'auction' &&
    nftStatus.auctionPlannedEndBlock &&
    convertBlockToMsTimestamp(nftStatus.auctionPlannedEndBlock)

  const name = nft.owner.__typename === 'NftOwnerChannel' ? nft.video.channel.title : nft.owner.member.handle

  const owner =
    nft?.owner.__typename === 'NftOwnerChannel'
      ? {
          name,
          assetUrl: creatorAvatarUrl,
          onClick: () => navigate(absoluteRoutes.viewer.channel(nft.video.channel.id)),
        }
      : nft?.owner.__typename === 'NftOwnerMember'
      ? {
          name,
          assetUrl: creatorAvatarUrl,
          onClick: () => name && navigate(absoluteRoutes.viewer.member(name)),
        }
      : undefined

  const nftDetails = {
    buyNow:
      nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
        ? nftStatus.buyNowPrice
          ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
          : undefined
        : undefined,
    creator: {
      name: nft?.video.channel.title || undefined,
      assetUrl: creatorAvatarUrl,
      onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
    },
    title: nft.video.title,
    type: 'nft',
    topBid:
      nftStatus?.status === 'auction' && nftStatus.topBid?.amount
        ? hapiBnToTokenNumber(new BN(nftStatus.topBid?.amount))
        : undefined,
  }

  useLayoutEffect(() => {
    if (plannedEndDateBlockTimestamp) {
      const auctionPlannedEndDate = new Date(plannedEndDateBlockTimestamp)

      const interval = setInterval(() => {
        const timeDiffInSeconds = (auctionPlannedEndDate?.getTime() - new Date().getTime()) / 1000
        if (timeDiffInSeconds < 0) {
          clearInterval(interval)
          setTimeLeft(null)
          return
        }

        const hours = Math.floor(timeDiffInSeconds / (60 * 60))
        const minutes = Math.floor((timeDiffInSeconds / 60) % 60)
        const seconds = Math.floor(timeDiffInSeconds % 60)
        setTimeLeft(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [plannedEndDateBlockTimestamp])

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
          videoPlaytime={30}
          onEnded={slideNext}
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

                {timeLeft && <DetailsContent tileSize="big" caption="AUCTION ENDS IN" content={timeLeft} />}
              </StatsContainer>
            </DetailsContainer>
          </InformationContainer>
        </CSSTransition>
      )}
    </Container>
  )
}
