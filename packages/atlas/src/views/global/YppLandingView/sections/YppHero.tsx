import BN from 'bn.js'
import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useMostPaidChannels } from '@/api/hooks/channel'
import { useGetJoystreamTotalEarningsQuery } from '@/api/queries/__generated__/nfts.generated'
import { SvgActionChevronR, SvgActionNewTab } from '@/assets/icons'
import crt_card from '@/assets/images/ypp-hero/crt-card-hero.webp'
import crt_dashboard from '@/assets/images/ypp-hero/crt-dashboard-hero.webp'
import payments from '@/assets/images/ypp-hero/crt-payments-hero.webp'
import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { GlassDetailsWidget } from '@/components/GlassDetailsWidget'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { PaidChannelCard } from '@/components/_channel/ChannelCard'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { cVar, transitions } from '@/styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import {
  ButtonWrapper,
  FrontImage,
  ImagesContainer,
  LeftImage,
  LogosContainer,
  RightImage,
  StyledInfiniteCarousel,
  WidgetsContainer,
} from './YppHero.styles'

import {
  GlowBox,
  GlowContainer,
  HeroBackgroundContainer,
  StyledLimitedWidthContainerHero,
} from '../YppLandingView.styles'

export type YppAtlasStatus = 'have-channel' | 'no-channel' | 'ypp-signed' | 'connect-wallet' | null

type YppHeroProps = {
  onSignUpClick: () => void
  onSelectChannel: () => void
  onViewerEarnings: () => void
  yppAtlasStatus: YppAtlasStatus
  hasAnotherUnsyncedChannel?: boolean
  selectedChannelTitle?: string | null
}

export const YppHero: FC<YppHeroProps> = ({ onSignUpClick, yppAtlasStatus, onViewerEarnings }) => {
  const xsMatch = useMediaMatch('xs')
  const xxsMatch = useMediaMatch('xxs')
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')
  const { ref, width, height } = useResizeObserver({ box: 'border-box' })
  const [, subtitleVariant, titleVariant] = useSectionTextVariants()
  const setIsYppChannelFlow = useYppStore((state) => state.actions.setIsYppChannelFlow)
  const setAuthModalOpenName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const { memberChannels, isLoggedIn } = useUser()
  const { trackRewardsCreateChannelButtonClick } = useSegmentAnalytics()
  const { channels, loading } = useMostPaidChannels()
  const { data, loading: loadingEarnings } = useGetJoystreamTotalEarningsQuery()
  const items = !loading
    ? channels?.map((channel) => <PaidChannelCard key={channel.id} channel={channel} />)
    : Array.from({ length: 30 }).map((_, idx) => <PaidChannelCard key={idx} loading />)
  const widgetContentTextVariant = mdMatch ? ('h700' as const) : ('h600' as const)

  return (
    <HeroBackgroundContainer noBackground>
      <StyledLimitedWidthContainerHero ref={ref} centerText>
        <GlowContainer>
          <GlowBox walkHeight={height ?? 0} walkWidth={width ?? 0} />
        </GlowContainer>
        <LayoutGrid as="header">
          <GridItem colSpan={{ base: 12, sm: 10, md: 12, lg: 10 }} colStart={{ sm: 2, md: 1, lg: 2 }}>
            <LogosContainer>
              <AppLogo
                variant="full"
                height={32}
                width={undefined}
                data-aos="fade-up"
                data-aos-delay="150"
                data-aos-offset="120"
                data-aos-easing="atlas-easing"
              />
            </LogosContainer>
            <Text
              as="h1"
              variant={titleVariant}
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Embrace Web3 creator economy
            </Text>
          </GridItem>
          <GridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }} colStart={{ sm: 2, md: 3, lg: 4 }}>
            <Text
              as="p"
              variant={subtitleVariant}
              color="colorText"
              margin={{ top: 4, bottom: 12 }}
              data-aos="fade-up"
              data-aos-delay="350"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Connect and discover earning opportunities with {atlasConfig.general.appName}.
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 12, sm: 8 }} colStart={{ sm: 3 }}>
            <ButtonWrapper data-aos="fade-up" data-aos-delay="450" data-aos-offset="40" data-aos-easing="atlas-easing">
              <SwitchTransition>
                <CSSTransition
                  timeout={parseInt(cVar('animationTimingFast', true))}
                  key={yppAtlasStatus ? 'status-set' : 'loading'}
                  classNames={transitions.names.fade}
                >
                  {yppAtlasStatus ? (
                    yppAtlasStatus === 'ypp-signed' ? (
                      <Button
                        size="large"
                        variant="secondary"
                        icon={<SvgActionChevronR />}
                        iconPlacement="right"
                        onClick={onSignUpClick}
                      >
                        Go to dashboard
                      </Button>
                    ) : (
                      <FlexBox gap={4} flow={xsMatch ? 'row' : 'column'} alignItems="center" justifyContent="center">
                        <Button
                          onClick={onSignUpClick}
                          fullWidth={!xsMatch}
                          size={xxsMatch && !xsMatch ? 'large' : smMatch ? 'large' : 'medium'}
                          id="rewards-sync-button"
                        >
                          Sync from YouTube
                        </Button>
                        {!memberChannels?.length ? (
                          <Button
                            onClick={() => {
                              trackRewardsCreateChannelButtonClick()
                              setIsYppChannelFlow(true)
                              setAuthModalOpenName(isLoggedIn ? 'createChannel' : 'signUp')
                            }}
                            fullWidth={!xsMatch}
                            size={xxsMatch && !xsMatch ? 'large' : smMatch ? 'large' : 'medium'}
                            variant="secondary"
                            id="rewards-new-channel-button"
                          >
                            Create New Channel
                          </Button>
                        ) : null}
                      </FlexBox>
                    )
                  ) : (
                    <SkeletonLoader width={190} height={48} />
                  )}
                </CSSTransition>
              </SwitchTransition>
            </ButtonWrapper>
          </GridItem>
        </LayoutGrid>
        <LayoutGrid data-aos="fade-up" data-aos-delay="450" data-aos-offset="40" data-aos-easing="atlas-easing">
          <GridItem
            margin={{ top: 4 }}
            colStart={{ base: 1, sm: 3, md: 4, lg: 5 }}
            colSpan={{ base: 12, sm: 8, md: 6, lg: 4 }}
          >
            <TextButton
              onClick={() => onViewerEarnings()}
              iconPlacement="right"
              size="large"
              icon={<SvgActionNewTab />}
            >
              Earn as viewer
            </TextButton>
            {/* <Text
              as="p"
              variant="t100"
              color="colorTextMuted"
              margin={{ top: hasAnotherUnsyncedChannel && selectedChannelTitle ? 4 : 2 }}
            >
              {hasAnotherUnsyncedChannel && selectedChannelTitle && (
                <>
                  Your channel "{selectedChannelTitle}" is already part of the YouTube Partner Program.{' '}
                  <SelectDifferentChannelButton onClick={onSelectChannel} color="colorTextPrimary">
                    Select a different channel
                  </SelectDifferentChannelButton>{' '}
                  to apply again.
                </>
              )}
              {yppAtlasStatus !== 'ypp-signed' && 'It takes under 1 minute and is 100% free.'}
            </Text>  */}
          </GridItem>
        </LayoutGrid>

        <LayoutGrid data-aos="fade-up" data-aos-delay="450" data-aos-offset="40" data-aos-easing="atlas-easing">
          <GridItem margin={{ top: 6 }} colStart={{ base: 1, lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
            <WidgetsContainer>
              <Text margin={{ bottom: 6 }} variant="h500" as="h5">
                Creator Earnings
              </Text>
            </WidgetsContainer>
            <WidgetsContainer justifyContent="space-between" gap={4} width="100%">
              <GlassDetailsWidget
                title="Total Rewards Paid"
                titleVariant="h300"
                customNode={
                  loadingEarnings ? (
                    <SkeletonLoader width={120} height={60} />
                  ) : (
                    <NumberFormat
                      as="h2"
                      format="short"
                      withDenomination
                      variant={widgetContentTextVariant}
                      value={new BN(data?.totalJoystreamEarnings.totalRewardsPaid ?? 0)}
                    />
                  )
                }
              />
              <GlassDetailsWidget
                title="NFTs Sold"
                titleVariant="h300"
                customNode={
                  loadingEarnings ? (
                    <SkeletonLoader width={120} height={60} />
                  ) : (
                    <NumberFormat
                      as="h2"
                      format="short"
                      withDenomination
                      variant={widgetContentTextVariant}
                      value={new BN(data?.totalJoystreamEarnings.nftSaleVolume ?? 0)}
                    />
                  )
                }
              />
              <GlassDetailsWidget
                title="Creator Tokens Sold"
                titleVariant="h300"
                customNode={
                  loadingEarnings ? (
                    <SkeletonLoader width={120} height={60} />
                  ) : (
                    <NumberFormat
                      as="h2"
                      format="short"
                      withDenomination
                      variant={widgetContentTextVariant}
                      value={new BN(data?.totalJoystreamEarnings.crtSaleVolume ?? 0)}
                    />
                  )
                }
              />
            </WidgetsContainer>
          </GridItem>
        </LayoutGrid>

        <ImagesContainer width="100%" justifyContent="center">
          <FrontImage src={crt_dashboard} alt="Hero back" width="1152" height="824" />
          {xsMatch && (
            <>
              <RightImage src={crt_card} alt="Hero back" width="1152" height="824" />
              <LeftImage src={payments} alt="Hero back" width="1152" height="824" />
            </>
          )}
        </ImagesContainer>
      </StyledLimitedWidthContainerHero>
      {items && items.length >= 7 && (
        <StyledInfiniteCarousel
          headerGridItemProps={{ colStart: { base: 1, lg: 2 }, colSpan: { base: 12, lg: 10 } }}
          carouselHorizonthalOffset={-32}
          title="Recently paid out channels"
          itemWidth={260}
          items={items}
          subTitle="What is a verified channel?"
          informationProps={{
            multiline: true,
            placement: 'top-end',
            text: `These ${atlasConfig.general.appName} channels applied to the YouTube Partner Program and got through the verification process successfully.`,
          }}
        />
      )}
    </HeroBackgroundContainer>
  )
}
