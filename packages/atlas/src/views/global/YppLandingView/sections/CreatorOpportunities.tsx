import styled from '@emotion/styled'

import { SvgLogoDiscordMonochrome } from '@/assets/icons'
import earning_crt from '@/assets/images/earnings/earning-crt.webp'
import earning_more from '@/assets/images/earnings/earning-more.webp'
import earning_nfts from '@/assets/images/earnings/earning-nfts.webp'
import earning_yt from '@/assets/images/earnings/earning-yt.webp'
import { FlexBox } from '@/components/FlexBox'
import { FlexGridItem, GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { cVar, media, sizes } from '@/styles'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

const earningsOptions = [
  {
    title: 'YouTubers',
    subtitle: 'Get sign up bonus and sync rewards with connecting YouTube channel.',
    image: earning_yt,
  },
  {
    title: 'Creator Tokens',
    subtitle: `Mint your own token and sell it on open market to raise funding for your ${atlasConfig.general.appName} channel.`,
    image: earning_crt,
  },
  {
    title: 'NFTs',
    subtitle: 'Mint your NFTs and earn from selling on marketplace and royalties with every future transaction.',
    image: earning_nfts,
  },
  {
    title: 'More earning',
    subtitle: 'Earn with building out community and social promotions.',
    image: earning_more,
  },
]

export const CreatorOpportunities = ({ onSignUpClick }: { onSignUpClick: () => void }) => {
  const setIsYppChannelFlow = useYppStore((state) => state.actions.setIsYppChannelFlow)
  const setAuthModalOpenName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const { trackRewardsCreateChannelButtonClick } = useSegmentAnalytics()
  const { memberChannels, isLoggedIn } = useUser()
  const xsMatch = useMediaMatch('xs')
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()
  const [earningTitleVariant, earningSubtitleVariant] = smMatch
    ? (['h600', 't400'] as const)
    : (['h500', 't300'] as const)

  return (
    <BackgroundContainer>
      <StyledLimitedWidthContainer centerText>
        <CenteredLayoutGrid>
          <HeaderGridItem
            as="header"
            colStart={{ sm: 2 }}
            colSpan={{ base: 12, sm: 10 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            <Text variant={titleVariant} as="span">
              Creator Earning Opportunities
            </Text>
            <Text
              variant={mdMatch ? 't400' : subtitleVariant}
              as="p"
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
              margin={{ top: 4, bottom: mdMatch ? 10 : 6 }}
            >
              Join {atlasConfig.general.appName}, grow your community with us and earn JOY tokens with the variety of
              Web3 native features.
            </Text>
          </HeaderGridItem>
          <EarningsBox colSpan={{ base: 12, xs: 10 }} colStart={{ base: 1, xs: 2 }}>
            {earningsOptions.map(({ title, subtitle, image }, idx) => (
              <FlexBox key={idx} gap={2} flow="column">
                <ImageBox>
                  <Image alt={`${title} image`} src={image} width="610px" height="420px" />
                  <ImageBorder />
                </ImageBox>

                <Text margin={{ top: 2 }} variant={earningTitleVariant} as="h3">
                  {title}
                </Text>
                <Text variant={earningSubtitleVariant} as="p" color="colorText">
                  {subtitle}
                </Text>
              </FlexBox>
            ))}
          </EarningsBox>
          <FlexGridItem
            margin={{ top: 16 }}
            flow="column"
            gap={6}
            alignItems="center"
            colSpan={{ base: 12 }}
            colStart={{ base: 1 }}
          >
            <FlexBox width="100%" flow={xsMatch ? 'row' : 'column'} alignItems="center" justifyContent="center" gap={4}>
              <Button onClick={onSignUpClick} fullWidth={!xsMatch} size="large">
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
                  size="large"
                  variant="secondary"
                >
                  Create New Channel
                </Button>
              ) : null}
            </FlexBox>
            <TextButton
              to={atlasConfig.general.joystreamDiscordUrl}
              size="large"
              icon={<SvgLogoDiscordMonochrome />}
              iconPlacement="right"
            >
              Connect with us on Discord.
            </TextButton>
          </FlexGridItem>
        </CenteredLayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}

export const EarningsBox = styled(GridItem)`
  display: grid;
  grid-template-columns: 1fr;
  text-align: left;
  row-gap: ${sizes(13)};

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
    column-gap: ${sizes(6)};
    row-gap: ${sizes(24)};
  }
`

const ImageBox = styled.div`
  width: 100%;
  height: auto;
  position: relative;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
`

export const ImageBorder = styled.div`
  position: absolute;
  inset: -2px;
  background-color: ${cVar('colorBackground')};
  border-radius: ${cVar('radiusSmall')};
  overflow: hidden;

  ::after {
    content: ' ';
    position: absolute;
    width: 50px;
    background-color: #d9d9d9;
    left: calc(50% - 50px);
    top: calc(50% - 400px);
    height: 800px;
    filter: blur(30px);
    transform: rotate(100deg);
  }

  ::before {
    content: ' ';
    position: absolute;
    width: 50px;
    background-color: #d9d9d9;
    left: calc(50% - 50px);
    top: calc(50% - 400px);
    height: 800px;
    filter: blur(30px);
    transform: rotate(30deg);
  }
`
