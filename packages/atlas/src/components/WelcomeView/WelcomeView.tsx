import AOS from 'aos'
import 'aos/dist/aos.css'
import { ReactElement, ReactNode, useEffect } from 'react'

import crtDashbaord2x from '@/assets/images/crt-dashboard-2x.webp'
import crtForm2x from '@/assets/images/crt-form-2x.webp'
import myUploads1x from '@/assets/images/my-uploads-1x.webp'
import myUploads2x from '@/assets/images/my-uploads-2x.webp'
import myVideos1x from '@/assets/images/my-videos-view-1x.webp'
import myVideos2x from '@/assets/images/my-videos-view-2x.webp'
import nftWorkspace1x from '@/assets/images/nft-workspace-1x.webp'
import nftWorkspace2x from '@/assets/images/nft-workspace-2x.webp'
import videoWorkspace1x from '@/assets/images/video-workspace-1x.webp'
import videoWorkspace2x from '@/assets/images/video-workspace-2x.webp'
import { Text } from '@/components/Text'
import { ButtonProps } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
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
  LinksGroupHeaderItem,
  OverflowHiddenContainer,
  SpecificComponentPlaceholer,
  StyledAnchor,
  StyledButton,
  StyledContainer,
  StyledIllustration,
  StyledLink,
  StyledSvgJoystreamLogoFull,
  SubTitle,
} from './WelcomeView.styles'

interface WelcomeViewProps {
  headTagTitle: string
  pageTitle: string

  title: string | ReactNode

  subtitle: string | ReactNode

  specificComponent?: ReactElement

  buttons: ButtonProps[]

  showLegalLinks?: boolean

  type: 'studio' | 'crt'
}

const typeIllustrationsFactory = (
  isLoggedIn?: boolean
): Record<WelcomeViewProps['type'], { srcSet: string; alt: string }[]> => ({
  'crt': [
    {
      srcSet: `${crtForm2x} 1x, ${crtForm2x} 2x`,
      alt: 'CRT creation form image',
    },
    {
      srcSet: `${crtDashbaord2x} 1x, ${crtDashbaord2x} 2x`,
      alt: 'CRT dashboard image',
    },
  ],
  // be aware that we reverse the order of image on md
  studio: [
    {
      srcSet: isLoggedIn ? `${myUploads1x} 1x, ${myUploads2x} 2x` : `${myVideos1x} 1x, ${myVideos2x} 2x`,
      alt: isLoggedIn
        ? `${atlasConfig.general.appName} studio downloads dashboard`
        : `${atlasConfig.general.appName} studio my videos dashboard`,
    },
    {
      srcSet: isLoggedIn
        ? `${nftWorkspace1x} 1x, ${nftWorkspace2x} 2x`
        : `${videoWorkspace1x} 1x, ${videoWorkspace2x} 2x`,
      alt: isLoggedIn
        ? `${atlasConfig.general.appName} studio nft workspace form`
        : `${atlasConfig.general.appName} studio video workspace form`,
    },
  ],
})

export const WelcomeView = ({
  headTagTitle,
  subtitle,
  title,
  pageTitle,
  specificComponent = <SpecificComponentPlaceholer />,
  buttons,
  showLegalLinks,
  type,
}: WelcomeViewProps) => {
  const mdMatch = useMediaMatch('md')
  const headTags = useHeadTags(headTagTitle)
  const { isLoggedIn } = useUser()

  const [firstIllustration, secondIllustration] = typeIllustrationsFactory(isLoggedIn)[type]

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
              rowSpan={showLegalLinks ? undefined : { md: 2 }}
            >
              <ContentWrapper>
                <Text as="h1" variant="h100" color="colorTextPrimary">
                  {pageTitle}
                </Text>
                {typeof title === 'string' ? (
                  <Text as="h1" variant={mdMatch ? 'h700' : 'h600'} margin={{ top: 2 }}>
                    {title}
                  </Text>
                ) : (
                  title
                )}
                {typeof subtitle === 'string' ? (
                  <SubTitle as="span" variant="t300">
                    {subtitle}
                  </SubTitle>
                ) : (
                  subtitle
                )}
                {specificComponent}
                <ButtonGroup>
                  {buttons.map((buttonProps, idx) => (
                    <StyledButton key={idx} {...buttonProps} />
                  ))}
                </ButtonGroup>
              </ContentWrapper>
            </HeaderGridItem>

            {showLegalLinks ? (
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
            ) : (
              <div />
            )}
            <ImageGridItem
              colSpan={{ xxs: 12, sm: 8, md: 6 }}
              colStart={{ sm: 3, md: 7 }}
              rowStart={{ base: 3, md: 1 }}
              rowSpan={{ md: 2 }}
            >
              <IllustrationWrapper
                topMargin={!mdMatch ? undefined : 6}
                data-aos="fade-left"
                data-aos-easing="atlas-easing"
              >
                <StyledIllustration {...firstIllustration} width="720" height="450" />
              </IllustrationWrapper>
              <IllustrationWrapper
                moveToTheLeft
                topMargin={mdMatch ? undefined : 6}
                data-aos={mdMatch ? LEFT_ANIMATION_MD : 'fade-right'}
                data-aos-easing="atlas-easing"
              >
                <StyledIllustration {...secondIllustration} width="720" height="450" stickToTheRightEdge={!mdMatch} />
              </IllustrationWrapper>
            </ImageGridItem>
          </ContentLayoutGrid>
        </StyledContainer>
      </OverflowHiddenContainer>
    </>
  )
}
