import { FC, ReactElement } from 'react'

import { SvgActionInfo, SvgActionSpeech, SvgActionTokensStack } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CallToActionButton, CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { atlasConfig } from '@/config'
import { YppWidgetIcons } from '@/config/configSchema'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { useYppStore } from '@/providers/ypp/ypp.store'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

import { CtaBanner } from './YppFooter.styles'

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
  const smMatch = useMediaMatch('sm')
  const setIsYppChannelFlow = useYppStore((state) => state.actions.setIsYppChannelFlow)
  const setAuthModalOpenName = useAuthStore((state) => state.actions.setAuthModalOpenName)
  const { trackRewardsCreateChannelButtonClick } = useSegmentAnalytics()
  const { memberChannels, isLoggedIn } = useUser()
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
              <Text variant={titleVariant} as="h2" color="colorCoreBaseWhite" margin={{ top: 1 }}>
                Pave the way to Web3 with your YouTube channel right away.
              </Text>

              <FlexBox
                width="100%"
                flow={smMatch ? 'row' : 'column'}
                alignItems="center"
                justifyContent="center"
                gap={4}
                marginTop={8}
              >
                <Button onClick={onSignUpClick} fullWidth={!smMatch} size="large">
                  Sync from YouTube
                </Button>
                {!memberChannels?.length ? (
                  <Button
                    onClick={() => {
                      trackRewardsCreateChannelButtonClick()
                      setIsYppChannelFlow(true)
                      setAuthModalOpenName(isLoggedIn ? 'createChannel' : 'signUp')
                    }}
                    fullWidth={!smMatch}
                    size="large"
                    variant="secondary"
                  >
                    Create New Channel
                  </Button>
                ) : null}
              </FlexBox>
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
