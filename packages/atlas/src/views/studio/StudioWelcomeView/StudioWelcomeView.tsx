import { FC } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionChannel, SvgActionInformative } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useUser } from '@/providers/user'

import {
  ButtonGroup,
  Header,
  SignInButton,
  StyledContainer,
  StyledHero,
  StyledSignInIllustrationSVG,
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

  return (
    <>
      {headTags}
      <StyledContainer>
        <Header>
          <StyledHero variant="h800">Welcome to Joystream Studio</StyledHero>
          <SubTitle variant="t300" secondary>
            Start your journey as a Joystream content creator. Manage your channels, publish video content, issue NFTs,
            and more!
          </SubTitle>
          <ButtonGroup>
            {isLoggedIn ? (
              <SignInButton size="large" to={absoluteRoutes.studio.newChannel()}>
                Create first channel
              </SignInButton>
            ) : (
              <SignInButton icon={<SvgActionChannel />} size="large" onClick={signIn}>
                Sign in
              </SignInButton>
            )}
            <Button variant="secondary" icon={<SvgActionInformative />} size="large" to="https://www.joystream.org/">
              How it works?
            </Button>
          </ButtonGroup>
        </Header>
        <StyledSignInIllustrationSVG />
      </StyledContainer>
    </>
  )
}
