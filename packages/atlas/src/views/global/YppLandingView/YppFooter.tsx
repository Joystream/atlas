import { FC } from 'react'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { SvgActionChevronR, SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/components/_icons'
import { JOYSTREAM_DISCORD_URL } from '@/config/env'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { CtaBanner, CtaCardRow, StyledBannerText, StyledButton } from './YppFooter.styles'
import { CenteredLimidtedWidthContainer } from './YppLandingView.styles'

export const YppFooter: FC = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <>
      <CenteredLimidtedWidthContainer>
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
      </CenteredLimidtedWidthContainer>
      <CtaCardRow>
        <CallToActionButton external colorVariant="lightBlue" icon={<SvgActionInfo />} label="Program details" />
        <CallToActionButton
          to={JOYSTREAM_DISCORD_URL}
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
