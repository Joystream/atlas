import { FC } from 'react'
import { useParallax } from 'react-scroll-parallax'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionChevronR } from '@/assets/icons'
import hero576 from '@/assets/images/ypp-hero/hero-576.webp'
import hero864 from '@/assets/images/ypp-hero/hero-864.webp'
import hero1152 from '@/assets/images/ypp-hero/hero-1152.webp'
import hero2304 from '@/assets/images/ypp-hero/hero-2304.webp'
import yt576 from '@/assets/images/ypp-hero/yt-576.webp'
import yt864 from '@/assets/images/ypp-hero/yt-864.webp'
import yt1152 from '@/assets/images/ypp-hero/yt-1152.webp'
import yt2304 from '@/assets/images/ypp-hero/yt-2304.webp'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { ChannelCard } from '@/components/_channel/ChannelCard'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'

import {
  BackImage,
  ButtonWrapper,
  FrontImage,
  HeroImageWrapper,
  SelectDifferentChannelButton,
  StyledInfiniteCarousel,
} from './YppHero.styles'
import { useGetYppLastVerifiedChannels } from './YppLandingView.hooks'
import { BackgroundContainer, StyledLimitedWidthContainer } from './YppLandingView.styles'

export type YppStatus = 'have-channel' | 'no-channel' | 'ypp-signed' | 'connect-wallet' | null

type YppHeroProps = {
  onSignUpClick: () => void
  onSelectChannel: () => void
  yppStatus: YppStatus
  hasAnotherUnsyncedChannel?: boolean
  selectedChannelTitle?: string | null
}

export const getButtonText = (variant: YppStatus) => {
  switch (variant) {
    case 'have-channel':
    case 'connect-wallet':
      return 'Sign up now'
    case 'no-channel':
      return 'Create channel & sign up'
    case 'ypp-signed':
      return 'Go to dashboard'
  }
}

export const YppHero: FC<YppHeroProps> = ({
  onSignUpClick,
  onSelectChannel,
  yppStatus,
  hasAnotherUnsyncedChannel,
  selectedChannelTitle,
}) => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')

  const endScroll = smMatch ? window.innerHeight / 3 : window.innerHeight
  const { ref: heroImageRef } = useParallax<HTMLImageElement>({
    startScroll: 0,
    endScroll,
    translateY: [0, -15],
  })

  const { channels, loading } = useGetYppLastVerifiedChannels()
  const items =
    channels?.length && !loading
      ? channels.map((channel) => <ChannelCard key={channel.id} channel={channel} withFollowButton={false} />)
      : Array.from({ length: 30 }).map((_, idx) => <ChannelCard key={idx} loading withFollowButton={false} />)

  return (
    <BackgroundContainer noBackground>
      <StyledLimitedWidthContainer centerText>
        <LayoutGrid as="header">
          <GridItem colSpan={{ base: 12, sm: 8, lg: 6 }} colStart={{ sm: 3, lg: 4 }}>
            <Text
              as="h1"
              variant={mdMatch ? 'h800' : 'h600'}
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              Connect your YouTube channel & get paid
            </Text>
            <Text
              as="p"
              variant="t300"
              color="colorText"
              margin={{ top: 4, bottom: 8 }}
              data-aos="fade-up"
              data-aos-delay="350"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
            >
              Reupload and backup your YouTube videos to receive a guaranteed payout in the YouTube Partner Program.
            </Text>
            <ButtonWrapper data-aos="fade-up" data-aos-delay="450" data-aos-offset="40" data-aos-easing="atlas-easing">
              <SwitchTransition>
                <CSSTransition
                  timeout={parseInt(cVar('animationTimingFast', true))}
                  key={yppStatus ? 'status-set' : 'loading'}
                  classNames={transitions.names.fade}
                >
                  {yppStatus ? (
                    <Button
                      size="large"
                      variant={yppStatus === 'ypp-signed' ? 'secondary' : 'primary'}
                      icon={<SvgActionChevronR />}
                      iconPlacement="right"
                      onClick={onSignUpClick}
                    >
                      {getButtonText(yppStatus)}
                    </Button>
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
              {yppStatus !== 'ypp-signed' && 'It takes under 1 minute and is 100% free.'}
            </Text>
          </GridItem>
        </LayoutGrid>
        <HeroImageWrapper data-aos="fade-up" data-aos-delay="550" data-aos-offset="80" data-aos-easing="atlas-easing">
          <BackImage
            srcSet={`${yt576} 576w, ${yt864} 864w, ${yt1152} 1152w, ${yt2304} 2304w`}
            alt="Hero back"
            width="1152"
            height="824"
          />
          <FrontImage
            ref={heroImageRef}
            srcSet={`${hero576} 576w, ${hero864} 864w, ${hero1152} 1152w, ${hero2304} 2304w`}
            alt="Hero front"
            width="1152"
            height="824"
          />
        </HeroImageWrapper>
        <LayoutGrid>
          <GridItem colStart={{ base: 1, sm: 2 }} colSpan={{ base: 12, sm: 10 }}>
            <StyledInfiniteCarousel
              title="Recent verified channels"
              itemWidth={200}
              items={items}
              subTitle="What is a verified channel?"
              informationProps={{
                multiline: true,
                placement: 'top-end',
                text: `These ${atlasConfig.general.appName} channels applied to the YouTube Partner Program and got through the verification process successfully.`,
              }}
            />
          </GridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}
