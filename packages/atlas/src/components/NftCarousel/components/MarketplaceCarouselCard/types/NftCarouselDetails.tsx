import BN from 'bn.js'
import { ReactNode, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { getNftStatus } from '@/api/hooks/nfts'
import { GetFeaturedNftsVideosQuery } from '@/api/queries/__generated__/nfts.generated'
import { SvgActionNotForSale } from '@/assets/icons'
import { AvatarGroup, AvatarGroupAvatar } from '@/components/Avatar/AvatarGroup'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import {
  Container,
  DetailsContainer,
  InformationContainer,
  StatsContainer,
  StyledLink,
  VideoContainer,
} from '@/components/NftCarousel/components/MarketplaceCarouselCard/MarketplaceCarouselCard.styles'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DetailsContent } from '@/components/_nft/NftTile'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { VideoPoster, VideoWrapper } from '@/components/_video/BackgroundVideoPlayer/BackgroundVideoPlayer.styles'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useTimer } from '@/hooks/useTimer/useTimer'
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
  const smMatch = useMediaMatch('sm')
  const navigate = useNavigate()
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const nftStatus = getNftStatus(nft, nft?.video)

  const ownerAvatarUrls =
    nft.owner.__typename === 'NftOwnerChannel'
      ? nft.owner.channel.avatarPhoto?.resolvedUrls
      : getMemberAvatar(nft.owner.member).urls
  const thumbnailUrls = nft.video.thumbnailPhoto?.resolvedUrls
  const mediaUrls = nft.video.media?.resolvedUrls
  const plannedEndDateBlockTimestamp =
    nftStatus?.status === 'auction' &&
    nftStatus.auctionPlannedEndBlock &&
    convertBlockToMsTimestamp(nftStatus.auctionPlannedEndBlock)
  const [timeLeft, timeLeftType] = useTimer(
    plannedEndDateBlockTimestamp ? new Date(plannedEndDateBlockTimestamp) : undefined
  )

  const isLoading = !thumbnailUrls || !mediaUrls
  const name = nft.owner.__typename === 'NftOwnerChannel' ? nft.video.channel.title : nft.owner.member.handle
  const owner = useMemo(
    () =>
      nft?.owner.__typename === 'NftOwnerChannel'
        ? {
            name,
            assetUrls: ownerAvatarUrls,
            onClick: () => navigate(absoluteRoutes.viewer.channel(nft.video.channel.id)),
          }
        : nft?.owner.__typename === 'NftOwnerMember'
        ? {
            name,
            assetUrls: ownerAvatarUrls,
            onClick: () => name && navigate(absoluteRoutes.viewer.member(name)),
          }
        : undefined,
    [ownerAvatarUrls, name, navigate, nft]
  )

  const nftDetails = useMemo(
    () => ({
      buyNow:
        nftStatus?.status === 'auction' || nftStatus?.status === 'buy-now'
          ? nftStatus.buyNowPrice
            ? hapiBnToTokenNumber(nftStatus.buyNowPrice)
            : undefined
          : undefined,
      creator: {
        name: nft?.video.channel.title || undefined,
        assetUrl: nft?.video.channel.avatarPhoto?.resolvedUrls,
        onClick: () => navigate(absoluteRoutes.viewer.channel(nft?.video.channel.id)),
      },
      title: nft.video.title,
      type: 'nft',
      topBid:
        nftStatus?.status === 'auction' && nftStatus.topBid?.amount
          ? hapiBnToTokenNumber(new BN(nftStatus.topBid?.amount))
          : undefined,
      minBid:
        nftStatus?.status === 'auction' && nftStatus.startingPrice
          ? hapiBnToTokenNumber(nftStatus.startingPrice)
          : undefined,
    }),
    [navigate, nft, nftStatus]
  )

  const avatars = useMemo(
    (): AvatarGroupAvatar[] => [
      {
        urls: nftDetails.creator?.assetUrl,
        tooltipText: `Creator: ${nftDetails.creator?.name}`,
        onClick: nftDetails.creator?.onClick,
      },
      ...(owner
        ? [
            {
              urls: owner?.assetUrls,
              tooltipText: `Owner: ${owner?.name}`,
              onClick: owner?.onClick,
            },
          ]
        : []),
    ],
    [nftDetails.creator?.assetUrl, nftDetails.creator?.name, nftDetails.creator?.onClick, owner]
  )

  if (isLoading) {
    return (
      <VideoContainer>
        <SkeletonLoader height="100%" width="100%" />
      </VideoContainer>
    )
  }

  return (
    <VideoCardWrapper
      videoId={nft.video.id}
      active={active}
      goNextSlide={slideNext}
      mediaUrls={mediaUrls}
      thumbnailUrls={thumbnailUrls}
      details={
        <DetailsContainer>
          <AvatarGroup spreadAvatars avatarStrokeColor="transparent" avatars={avatars} />
          <Text variant={smMatch ? 'h500' : 'h400'} as={smMatch ? 'h5' : 'h4'}>
            <StyledLink to={absoluteRoutes.viewer.video(nft.video.id)}>{nftDetails.title}</StyledLink>
          </Text>
          <StatsContainer>
            {nftDetails.buyNow && (
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="BUY NOW"
                content={nftDetails.buyNow}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
            )}
            {nftDetails.topBid && (
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="TOP BID"
                content={nftDetails.topBid}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
            )}
            {nftDetails.minBid && (
              <DetailsContent
                avoidIconStyling
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="MIN BID"
                content={nftDetails.minBid}
                icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
                withDenomination
              />
            )}
            {nftStatus?.status === 'idle' && (
              <DetailsContent
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="STATUS"
                content="Not for sale"
                secondary
                icon={<SvgActionNotForSale width={smMatch ? 24 : 16} height={smMatch ? 24 : 16} />}
              />
            )}

            {timeLeft && (
              <DetailsContent
                tileSize={smMatch ? 'big' : 'bigSmall'}
                caption="AUCTION ENDS IN"
                content={
                  timeLeftType === 'countdown'
                    ? timeLeft.split(':').map((tick, i) => {
                        return (
                          <span key={`timer-${i}`}>
                            {i !== 0 ? (
                              <Text as="span" color="colorText" variant={smMatch ? 'h500' : 'h400'}>
                                :
                              </Text>
                            ) : null}
                            <Text as="span" variant={smMatch ? 'h500' : 'h400'}>
                              {tick}
                            </Text>
                          </span>
                        )
                      })
                    : timeLeft
                }
              />
            )}
          </StatsContainer>
        </DetailsContainer>
      }
    />
  )
}

type VideoCardWrapperProps = {
  active: boolean
  videoId: string
  mediaUrls: string[]
  thumbnailUrls: string[]
  goNextSlide: () => void
  details: ReactNode
}

export const VideoCardWrapper = ({
  active,
  goNextSlide,
  thumbnailUrls,
  mediaUrls,
  videoId,
  details,
}: VideoCardWrapperProps) => {
  const [isPaused, setIsPaused] = useState(!active)
  const debouncedActive = useDebounceValue(active, 500)

  return (
    <Container>
      <VideoContainer>
        {active ? (
          <BackgroundVideoPlayer
            videoId={videoId}
            withFade={active ? debouncedActive : active}
            playing={active ? debouncedActive : active}
            muted={true}
            onPause={() => setIsPaused(true)}
            onPlay={() => setIsPaused(false)}
            preload="auto"
            src={mediaUrls ?? undefined}
            poster={thumbnailUrls ?? undefined}
            handleActions={active ? debouncedActive : active}
            videoPlaytime={30}
            onEnded={goNextSlide}
          />
        ) : (
          <VideoWrapper>
            <VideoPoster resolvedUrls={thumbnailUrls ?? undefined} type="cover" alt="" />
          </VideoWrapper>
        )}
      </VideoContainer>
      {active && (
        <CSSTransition in={active} timeout={100} classNames={transitions.names.fade} unmountOnExit>
          <InformationContainer isPaused={isPaused}>{details}</InformationContainer>
        </CSSTransition>
      )}
    </Container>
  )
}
