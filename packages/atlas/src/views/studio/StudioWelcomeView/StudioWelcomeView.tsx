import { FC } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChannel, SvgActionInformative, SvgActionMember } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useUser } from '@/providers/user'

import {
  ButtonGroup,
  Header,
  SignInButton,
  StyledContainer,
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
          <Text as="h1" variant="h800" margin={{ top: 8 }}>
            Welcome to Atlas Studio
          </Text>
          <SubTitle as="p" variant="t300" color="colorText">
            Start your journey as a Atlas content creator. Manage your channels, publish video content, issue NFTs, and
            more!
          </SubTitle>
          <ButtonGroup>
            {isLoggedIn ? (
              <SignInButton icon={<SvgActionChannel />} size="large" to={absoluteRoutes.studio.newChannel()}>
                Create first channel
              </SignInButton>
            ) : (
              <SignInButton icon={<SvgActionMember />} size="large" onClick={() => signIn()}>
                Connect wallet
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
