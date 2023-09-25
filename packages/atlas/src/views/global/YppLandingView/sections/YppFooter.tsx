import { FC, ReactElement } from 'react'

import { SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/assets/icons'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { CallToActionButton, CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { atlasConfig } from '@/config'
import { YppWidgetIcons } from '@/config/configSchema'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import { CtaBanner, StyledBannerText, StyledButton } from './YppFooter.styles'

import { StyledLimitedWidthContainer } from '../YppLandingView.styles'

export const configYppIconMapper: Record<YppWidgetIcons, ReactElement> = {
  info: <SvgActionInfo />,
  message: <SvgActionSpeech />,
  tokenStack: <SvgActionTokensStack />,
}

type YppFooterSectionProps = {
  onSignUpClick: () => void
}

export const YppFooter: FC<YppFooterSectionProps> = ({ onSignUpClick }) => {
  const [titleVariant] = useSectionTextVariants()

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
              <StyledBannerText variant={titleVariant} as="h2" color="colorCoreBaseWhite" margin={{ top: 1 }}>
                Pave the way to Web3 with your YouTube channel right away.
              </StyledBannerText>

              <StyledButton onClick={onSignUpClick}>Authorize with YouTube</StyledButton>
            </CtaBanner>
          </GridItem>
        </LayoutGrid>
      </StyledLimitedWidthContainer>
      {atlasConfig.features.ypp.widgets && (
        <CallToActionWrapper itemsCount={atlasConfig.features.ypp.widgets.length}>
          {atlasConfig.features.ypp.widgets.map((widget) => (
            <CallToActionButton
              icon={widget.icon && configYppIconMapper[widget.icon]}
              key={widget.title}
              external
              colorVariant="lightBlue"
              label={widget.title}
              to={widget.link}
            />
          ))}
        </CallToActionWrapper>
      )}
    </>
  )
}
