import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { useRecentlyPaidChannels } from '@/api/hooks/channel'
import { SvgActionChevronR, SvgLogoGoogleWhiteFull, SvgLogoYoutubeWhiteFull } from '@/assets/icons'
import hero from '@/assets/images/ypp-hero/hero.webp'
import yt from '@/assets/images/ypp-hero/yt.webp'
import { AppLogo } from '@/components/AppLogo'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { GoogleButton } from '@/components/_buttons/GoogleButton'
import { PaidChannelCard } from '@/components/_channel/ChannelCard'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import {
  BackImage,
  ButtonWrapper,
  FrontImage,
  HeroImageWrapper,
  LogosContainer,
  SelectDifferentChannelButton,
  StyledInfiniteCarousel,
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
  const smMatch = useMediaMatch('sm')
  const { ref, width, height } = useResizeObserver({ box: 'border-box' })
  const [, subtitleVariant, titleVariant] = useSectionTextVariants()
  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const { ref: heroImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll,
    translateY: [0, -15],
  })

  const { channels, loading } = useRecentlyPaidChannels()
  const items = !loading
    ? channels?.map((extendedChannels) => (
        <PaidChannelCard
          key={extendedChannels.channel.id}
          amount={extendedChannels.amount}
          channel={extendedChannels.channel}
        />
      ))
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
              Connect your YouTube channel & get paid
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
              YouTube videos get automatically synced to your {atlasConfig.general.appName} channel, without any
              additional effort.
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 12, sm: 8 }} colStart={{ sm: 3 }}>
            <LogosContainer data-aos="fade-up" data-aos-delay="350" data-aos-offset="40" data-aos-easing="atlas-easing">
              <SvgLogoYoutubeWhiteFull />
              <SvgLogoGoogleWhiteFull />
            </LogosContainer>
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
                      <GoogleButton onClick={onSignUpClick} />
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
          <GridItem colStart={{ base: 1, sm: 3, md: 4, lg: 5 }} colSpan={{ base: 12, sm: 8, md: 6, lg: 4 }}>
            <Text
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
            </Text>
          </GridItem>
        </LayoutGrid>
        <HeroImageWrapper data-aos="fade-up" data-aos-delay="550" data-aos-offset="80" data-aos-easing="atlas-easing">
          <BackImage src={yt} alt="Hero back" width="1152" height="824" />
          <FrontImage ref={heroImageRef} src={hero} alt="Hero front" width="1152" height="824" />
        </HeroImageWrapper>
      </StyledLimitedWidthContainerHero>
      {items && items.length >= 7 && (
        <StyledInfiniteCarousel
          headerGridItemProps={{ colStart: { base: 1, lg: 2 }, colSpan: { base: 12, lg: 10 } }}
          carouselHorizonthalOffset={-32}
          title="Signed up channels"
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
