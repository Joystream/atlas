import AOS from 'aos'
import 'aos/dist/aos.css'
import { FC, useEffect } from 'react'

import { SvgActionChannel, SvgActionMember, SvgActionPlay } from '@/assets/icons'
import myUploads1x from '@/assets/images/my-uploads-1x.webp'
import myUploads2x from '@/assets/images/my-uploads-2x.webp'
import myVideos1x from '@/assets/images/my-videos-view-1x.webp'
import myVideos2x from '@/assets/images/my-videos-view-2x.webp'
import nftWorkspace1x from '@/assets/images/nft-workspace-1x.webp'
import nftWorkspace2x from '@/assets/images/nft-workspace-2x.webp'
import videoWorkspace1x from '@/assets/images/video-workspace-1x.webp'
import videoWorkspace2x from '@/assets/images/video-workspace-2x.webp'
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
  LEFT_ANIMATION_MD,
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

  useEffect(() => {
    AOS.init({
      duration: 750,
      once: true,
    })
  }, [])

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
                      Set up membership
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
              <IllustrationWrapper
                topMargin={!mdMatch ? undefined : 6}
                data-aos="fade-left"
                data-aos-delay="200"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <StyledIllustration
                  srcSet={isLoggedIn ? `${myUploads1x} 1x, ${myUploads2x} 2x` : `${myVideos1x} 1x, ${myVideos2x} 2x`}
                  width="720"
                  height="450"
                  alt={
                    isLoggedIn
                      ? `${atlasConfig.general.appName} studio downloads dashboard`
                      : `${atlasConfig.general.appName} studio my videos dashboard`
                  }
                />
              </IllustrationWrapper>
              <IllustrationWrapper
                moveToTheLeft
                topMargin={mdMatch ? undefined : 6}
                data-aos={mdMatch ? LEFT_ANIMATION_MD : 'fade-right'}
                data-aos-delay="200"
                data-aos-offset="80"
                data-aos-easing="atlas-easing"
              >
                <StyledIllustration
                  srcSet={
                    isLoggedIn
                      ? `${nftWorkspace1x} 1x, ${nftWorkspace2x} 2x`
                      : `${videoWorkspace1x} 1x, ${videoWorkspace2x} 2x`
                  }
                  width="720"
                  height="450"
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
