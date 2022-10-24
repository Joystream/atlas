import { FC } from 'react'

import { SvgActionChannel, SvgActionInformative, SvgActionMember } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useUser } from '@/providers/user/user.hooks'

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
  const { openSignInDialog } = useDisplaySignInDialog()

  return (
    <>
      {headTags}
      <StyledContainer>
        <Header>
          <Text as="h1" variant="h800" margin={{ top: 8 }}>
            Welcome to {atlasConfig.general.appName} Studio
          </Text>
          <SubTitle as="p" variant="t300" color="colorText">
            Start your journey as a {atlasConfig.general.appName} content creator. Manage your channels, publish video
            content, issue NFTs, and more!
          </SubTitle>
          <ButtonGroup>
            {isLoggedIn ? (
              <SignInButton icon={<SvgActionChannel />} size="large" to={absoluteRoutes.studio.newChannel()}>
                Create first channel
              </SignInButton>
            ) : (
              <SignInButton icon={<SvgActionMember />} size="large" onClick={() => signIn(undefined, openSignInDialog)}>
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
