import { FC } from 'react'

import { SvgActionChannel, SvgActionMember, SvgActionPlay } from '@/assets/icons'
import downloadsMockup from '@/assets/images/downloads-mockup.webp'
import myVideosMockup from '@/assets/images/my-videos-mockup.webp'
import nftWorkspaceMockup from '@/assets/images/nft-workspace-mockup.webp'
import videoWorkspaceMockup from '@/assets/images/video-workspace-mockup.webp'
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
  ContentWrapper,
  HeaderGridItem,
  IllustrationWrapper,
  ImageGridItem,
  LeftStep,
  LinksGroupHeaderItem,
  OverflowHiddenContainer,
  RightStep,
  SignInButton,
  StepsContainer,
  StyledAnchor,
  StyledContainer,
  StyledIllustration,
  StyledLink,
  StyledSvgActionChevronR,
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
      <OverflowHiddenContainer>
        {headTags}
        <StyledContainer>
          <ContentLayoutGrid>
            <HeaderGridItem
              colSpan={{ xxs: 12, sm: 8, md: 5 }}
              colStart={{ sm: 3, md: 1 }}
              rowStart={1}
              rowSpan={{ md: 2 }}
            >
              <ContentWrapper>
                <Text as="h1" variant="h100" color="colorTextPrimary">
                  {atlasConfig.general.appName} studio
                </Text>
                <Text as="h1" variant={mdMatch ? 'h700' : 'h600'} margin={{ top: 2 }}>
                  {isLoggedIn ? 'Ready to create your channel?' : 'Your creator journey starts here'}
                </Text>
                <SubTitle as="p" variant="t300" color="colorText">
                  {isLoggedIn
                    ? 'Create a channel to upload videos, sell NFTs, make playlists (coming soon), and more!'
                    : 'To create a channel, first set up a free Joystream membership with our simple step-by-step wizard.'}
                </SubTitle>
                <StepsContainer>
                  <LeftStep
                    title="Set up membership"
                    number={1}
                    variant={isLoggedIn ? 'completed' : 'current'}
                    showOtherStepsOnMobile
                  />
                  <StyledSvgActionChevronR />
                  <RightStep
                    title="Create channel"
                    number={2}
                    variant={isLoggedIn ? 'current' : 'future'}
                    showOtherStepsOnMobile
                  />
                </StepsContainer>
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
                  <TextButton
                    variant="tertiary"
                    icon={<SvgActionPlay />}
                    size="large"
                    to={absoluteRoutes.viewer.index()}
                  >
                    Go to {atlasConfig.general.appName}
                  </TextButton>
                </ButtonGroup>
              </ContentWrapper>
            </HeaderGridItem>

            <LinksGroupHeaderItem colSpan={{ xxs: 12, sm: 8, md: 5 }} colStart={{ sm: 3, md: 1 }} rowStart={2}>
              <Text as="span" variant="t100" color="inherit" margin={{ top: 2 }}>
                <StyledAnchor href={atlasConfig.general.joystreamLandingPageUrl} target="_blank">
                  Powered by
                  <StyledSvgJoystreamLogoFull />
                </StyledAnchor>
              </Text>
              <Text as="span" variant="t100" color="inherit" margin={{ top: 2, left: 2, right: 2 }}>
                •
              </Text>
              <StyledLink to={absoluteRoutes.legal.termsOfService()}>
                <Text as="span" variant="t100" color="inherit" margin={{ top: 2 }}>
                  Terms of service
                </Text>
              </StyledLink>
              <Text as="span" variant="t100" color="inherit" margin={{ top: 2, left: 2, right: 2 }}>
                •
              </Text>
              <StyledLink to={absoluteRoutes.legal.copyright()}>
                <Text as="span" variant="t100" color="inherit" margin={{ top: 2 }}>
                  Copyright policy
                </Text>
              </StyledLink>
            </LinksGroupHeaderItem>
            <ImageGridItem
              colSpan={{ xxs: 12, sm: 8, md: 6 }}
              colStart={{ sm: 3, md: 6 }}
              rowStart={{ base: 3, md: 1 }}
              rowSpan={{ md: 2 }}
            >
              {/* be aware that we reverse the order of image on md */}
              <IllustrationWrapper topMargin={!mdMatch ? undefined : 6}>
                <StyledIllustration
                  src={isLoggedIn ? downloadsMockup : myVideosMockup}
                  alt={
                    isLoggedIn
                      ? `${atlasConfig.general.appName} studio downloads dashboard`
                      : `${atlasConfig.general.appName} studio my videos dashboard`
                  }
                />
              </IllustrationWrapper>
              <IllustrationWrapper moveToTheLeftOnMd topMargin={mdMatch ? undefined : 6}>
                <StyledIllustration
                  src={isLoggedIn ? nftWorkspaceMockup : videoWorkspaceMockup}
                  alt={
                    isLoggedIn
                      ? `${atlasConfig.general.appName} studio nft workspace form`
                      : `${atlasConfig.general.appName} studio video workspace form`
                  }
                  stickToTheRightEdge={!mdMatch}
                />
              </IllustrationWrapper>
            </ImageGridItem>
          </ContentLayoutGrid>
        </StyledContainer>
      </OverflowHiddenContainer>
    </>
  )
}
