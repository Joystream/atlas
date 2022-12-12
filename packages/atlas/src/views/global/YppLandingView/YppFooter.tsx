import { FC } from 'react'

import { SvgActionChevronR } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { CallToActionButton } from '@/components/_buttons/CallToActionButton'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { CtaBanner, CtaCardRow, StyledBannerText, StyledButton } from './YppFooter.styles'
import { StyledLimitedWidthContainer } from './YppLandingView.styles'

type YppFooterSectionProps = {
  onSignUpClick: () => void
}

export const YppFooter: FC<YppFooterSectionProps> = ({ onSignUpClick }) => {
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

              <StyledButton size="large" icon={<SvgActionChevronR />} onClick={onSignUpClick} iconPlacement="right">
                Authorize with YouTube
              </StyledButton>
            </CtaBanner>
          </GridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
      {atlasConfig.features.ypp.widgets && (
        <CtaCardRow itemsCount={atlasConfig.features.ypp.widgets.length}>
          {atlasConfig.features.ypp.widgets.map((widget) => (
            <CallToActionButton
              key={widget.title}
              external
              colorVariant="lightBlue"
              label={widget.title}
              to={widget.link}
            />
          ))}
        </CtaCardRow>
      )}
    </>
  )
}
