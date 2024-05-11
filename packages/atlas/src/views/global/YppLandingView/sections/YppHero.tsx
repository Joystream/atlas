import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useMostPaidChannels } from '@/api/hooks/channel'
import { SvgActionChevronR, SvgActionNewTab } from '@/assets/icons'
import yt from '@/assets/images/ypp-hero/yt.webp'
import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { GlassDetailsWidget } from '@/components/GlassDetailsWidget'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { PaidChannelCard } from '@/components/_channel/ChannelCard'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
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
  yppAtlasStatus: YppAtlasStatus
  hasAnotherUnsyncedChannel?: boolean
  selectedChannelTitle?: string | null
}

export const YppHero: FC<YppHeroProps> = ({
  onSignUpClick,
  onSelectChannel,
  yppAtlasStatus,
  hasAnotherUnsyncedChannel,
  selectedChannelTitle,
}) => {
  const xsMatch = useMediaMatch('xs')
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const { ref, width, height } = useResizeObserver({ box: 'border-box' })
  const [, subtitleVariant, titleVariant] = useSectionTextVariants()

  const widgetContentTextVariant = lgMatch ? 'h800' : mdMatch ? 'h700' : 'h600'

  const { channels, loading } = useMostPaidChannels()
  const items = !loading
    ? channels?.map((channel) => <PaidChannelCard key={channel.id} channel={channel} />)
    : Array.from({ length: 30 }).map((_, idx) => <PaidChannelCard key={idx} loading />)

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
                        <Button fullWidth={!xsMatch} size="large">
                          Sync from YouTube
                        </Button>
                        <Button fullWidth={!xsMatch} size="large" variant="secondary">
                          Create New Channel
                        </Button>
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
            margin={{ top: 6 }}
            colStart={{ base: 1, sm: 3, md: 4, lg: 5 }}
            colSpan={{ base: 12, sm: 8, md: 6, lg: 4 }}
          >
            <TextButton iconPlacement="right" size="large" icon={<SvgActionNewTab />}>
              Earn as viewer
            </TextButton>
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
                tooltip={{ text: 'xd' }}
                customNode={
                  <Text variant={widgetContentTextVariant} as="h2">
                    204M
                  </Text>
                }
              />
              <GlassDetailsWidget
                title="NFTs sold"
                titleVariant="h300"
                tooltip={{ text: 'xd' }}
                customNode={
                  <Text variant={widgetContentTextVariant} as="h2">
                    204M
                  </Text>
                }
              />
              <GlassDetailsWidget
                title="Creator Tokens Sold"
                titleVariant="h300"
                tooltip={{ text: 'xd' }}
                customNode={
                  <Text variant={widgetContentTextVariant} as="h2">
                    204M
                  </Text>
                }
              />
            </WidgetsContainer>
          </GridItem>
        </LayoutGrid>

        {xsMatch && (
          <ImagesContainer width="100%" justifyContent="center">
            <FrontImage src={yt} alt="Hero back" width="1152" height="824" />
            <RightImage src={yt} alt="Hero back" width="1152" height="824" />
            <LeftImage src={yt} alt="Hero back" width="1152" height="824" />
          </ImagesContainer>
        )}
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
