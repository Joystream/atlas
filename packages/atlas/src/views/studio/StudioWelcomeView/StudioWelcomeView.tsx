import { FC } from 'react'

import { SvgActionChannel, SvgActionMember, SvgActionPlay } from '@/assets/icons'
import downloadsMockup from '@/assets/images/downloads-mockup.webp'
import myVideosMockup from '@/assets/images/my-videos-mockup.webp'
import nftWorkspaceMockup from '@/assets/images/nft-workspace-mockup.webp'
import videoWorkspaceMockup from '@/assets/images/video-workspace-mockup.webp'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'

import {
  ButtonGroup,
  ContentLayoutGrid,
  HeaderGridItem,
  IllustrationWrapper,
  ImageLayoutGrid,
  LinksGroup,
  SignInButton,
  StyledAnchor,
  StyledContainer,
  StyledIllustration,
  StyledSvgJoystreamLogoFull,
  SubTitle,
} from './StudioWelcomeView.styles'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

export const StudioWelcomeView: FC = () => {
  const { signIn, isLoggedIn } = useUser()
  const headTags = useHeadTags('Studio')
  const { openSignInDialog } = useDisplaySignInDialog()
  const mdMatch = useMediaMatch('md')

  return (
    <>
      {headTags}
      <StyledContainer>
        <ContentLayoutGrid>
          <HeaderGridItem colSpan={{ xxs: 12, sm: 8 }} colStart={{ sm: 3 }}>
            <Text as="h1" variant="h100" margin={{ top: 8 }} color="colorTextPrimary">
              {atlasConfig.general.appName} studio
            </Text>
            <Text as="h1" variant={mdMatch ? 'h700' : 'h600'} margin={{ top: 2 }}>
              Your creator journey starts here
            </Text>
            <SubTitle as="p" variant="t300" color="colorText">
              To create a channel, first set up a free Joystream membership with our simple step-by-step wizard.
            </SubTitle>
            <ButtonGroup>
              {isLoggedIn ? (
                <SignInButton icon={<SvgActionChannel />} size="large" to={absoluteRoutes.studio.newChannel()}>
                  Create first channel
                </SignInButton>
              ) : (
                <SignInButton
                  icon={<SvgActionMember />}
                  size="large"
                  onClick={() => signIn(undefined, openSignInDialog)}
                >
                  Connect wallet
                </SignInButton>
              )}
              <TextButton variant="tertiary" icon={<SvgActionPlay />} size="large" to={absoluteRoutes.viewer.index()}>
                Go to {atlasConfig.general.appName}
              </TextButton>
            </ButtonGroup>
            <LinksGroup>
              <StyledAnchor href={atlasConfig.general.joystreamLandingPageUrl} target="_blank">
                <Text as="span" variant="t100" color="inherit">
                  Powered by
                </Text>
                <StyledSvgJoystreamLogoFull />
              </StyledAnchor>
              <Text as="span" variant="t100" color="inherit">
                •
              </Text>
            </LinksGroup>
          </HeaderGridItem>
        </ContentLayoutGrid>
        <ImageLayoutGrid>
          <GridItem rowStart={1} colSpan={{ xxs: 12, sm: 8 }} colStart={{ sm: 3 }}>
            <IllustrationWrapper>
              <StyledIllustration src={isLoggedIn ? downloadsMockup : myVideosMockup} alt="" />
            </IllustrationWrapper>
          </GridItem>
          <GridItem rowStart={2} colSpan={{ xxs: 12, sm: 10 }} colStart={{ sm: 3 }}>
            <IllustrationWrapper>
              <StyledIllustration
                src={isLoggedIn ? nftWorkspaceMockup : videoWorkspaceMockup}
                alt=""
                stickToTheRightEdge
              />
            </IllustrationWrapper>
          </GridItem>
        </ImageLayoutGrid>
      </StyledContainer>
    </>
  )
}
