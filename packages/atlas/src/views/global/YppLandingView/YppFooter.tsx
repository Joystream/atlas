import { FC } from 'react'

import { SvgActionChevronR, SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { CtaBanner, CtaCardRow, StyledBannerText, StyledButton } from './YppFooter.styles'
import { StyledLimitedWidthContainer } from './YppLandingView.styles'

export const YppFooter: FC = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <>
      <StyledLimitedWidthContainer
        centerText
        data-aos="fade-up"
        data-aos-delay="250"
        data-aos-offset="80"
        data-aos-easing="atlas-easing"
      >
        <LayoutGrid>
          <GridItem colStart={{ lg: 2 }} colSpan={{ base: 12, lg: 10 }}>
            <CtaBanner>
              <Text variant="h100" as="p" color="colorText">
                Get started now
              </Text>
              <StyledBannerText
                variant={mdMatch ? 'h700' : 'h600'}
                as="h2"
                color="colorCoreBaseWhite"
                margin={{ top: 1 }}
              >
                Get the most out of your YouTube channel
              </StyledBannerText>

              <StyledButton size="large" icon={<SvgActionChevronR />} iconPlacement="right">
                Authorize with YouTube
              </StyledButton>
            </CtaBanner>
          </GridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
      <CtaCardRow>
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionInfo />} label="Program details" />
        <CallToActionButton
          to={atlasConfig.general.joystreamDiscordUrl}
          external
          colorVariant="lightBlue"
          icon={<SvgActionSpeech />}
          label="Discord"
        />
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionTokensStack />} label="Payments" />
      </CtaCardRow>
    </>
  )
}
