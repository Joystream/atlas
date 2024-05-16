import styled from '@emotion/styled'
import { MutableRefObject } from 'react'

import { SvgLogoDiscordMonochrome } from '@/assets/icons'
import viewer_earnings_crt from '@/assets/images/viewer-earnings/viewer-earning-crt-trade.webp'
import viewer_earnings_nft from '@/assets/images/viewer-earnings/viewer-earning-nft.webp'
import viewer_earnings_referrals from '@/assets/images/viewer-earnings/viewer-earning-referrals.webp'
import viewer_earnings_rs from '@/assets/images/viewer-earnings/viewer-earning-revenue-share.webp'
import { FlexBox } from '@/components/FlexBox'
import { FlexGridItem, GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, media, sizes, square } from '@/styles'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

const viewerEarningsOptions = [
  {
    title: 'Earn with Referrals',
    subtitle: 'Refer YouTube channels and earn when they sign up using your link.',
    image: viewer_earnings_referrals,
  },
  {
    title: 'Claim Channels Revenue Share',
    subtitle: `Buy creator tokens and claim part of channel's revenue.`,
    image: viewer_earnings_rs,
  },
  {
    title: 'Trade Creator Tokens',
    subtitle: 'Become an early investor and trade your tokens once the channel grows in popularity.',
    image: viewer_earnings_crt,
  },
  {
    title: 'Trade NFTs',
    subtitle: (
      <>
        Own and trade collectibles from wide variety of channels. {/*<TextButton size="large">Learn more</TextButton>*/}
      </>
    ),
    image: viewer_earnings_nft,
  },
]

export const ViewerOpportunities = ({ sectionRef }: { sectionRef: MutableRefObject<HTMLDivElement | null> }) => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()
  const [earningTitleVariant, earningSubtitleVariant] = smMatch
    ? (['h600', 't400'] as const)
    : (['h500', 't300'] as const)

  return (
    <BackgroundContainer ref={sectionRef}>
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
              Viewers Earning Opportunities
            </Text>
            <Text
              variant={subtitleVariant}
              as="p"
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
              margin={{ top: 4, bottom: mdMatch ? 10 : 6 }}
            >
              Discover the world of possibilities from collective channel ownership, token trading and earning by
              contributing to {atlasConfig.general.appName} community growth with referrals.
            </Text>
          </HeaderGridItem>
          <EarningsBox colSpan={{ base: 12, xs: 10 }} colStart={{ base: 1, xs: 2 }}>
            {viewerEarningsOptions.map(({ title, subtitle, image }, idx) => (
              <FlexBox key={idx} gap={2} flow="column">
                <ImageBox>
                  <Image alt={`${title} image`} src={image} width="529px" height="360" />
                  <ImageBorder />
                </ImageBox>

                <Text margin={{ top: 2 }} variant={earningTitleVariant} as="h3">
                  {title}
                </Text>
                <Text variant={earningSubtitleVariant} as="span" color="colorText">
                  {subtitle}
                </Text>
              </FlexBox>
            ))}
          </EarningsBox>
          <FlexGridItem
            margin={{ top: 16 }}
            flow="column"
            gap={6}
            alignItems="start"
            colSpan={{ base: 12, sm: 10 }}
            colStart={{ base: 1, sm: 2 }}
          >
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

export const CheckBox = styled.div<{ square: number }>`
  background: ${cVar('colorBackgroundSuccess')};
  display: grid;
  place-items: center;
  padding: ${sizes(2)};
  border-radius: 50%;
  width: fit-content;
  margin: 0 auto;
  ${(props) => square(props.square)};

  svg {
    width: 100%;
    height: 100%;
  }
`

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
