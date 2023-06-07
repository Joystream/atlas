import { FC } from 'react'

import { SvgActionPlay } from '@/assets/icons'
import { Text } from '@/components/Text'
import { SubTitle, WelcomeView } from '@/components/WelcomeView'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'

import { InlineText, LeftStep, RightStep, StepsContainer, StyledSvgActionChevronR } from './StudioWelcomeView.styles'

export type Membership = {
  id: string
  handle: string
  about?: string
  avatarUri?: string
}

export const StudioWelcomeView: FC = () => {
  const { isLoggedIn } = useUser()
  const mdMatch = useMediaMatch('md')
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()

  return (
    <WelcomeView
      headTagTitle="Studio"
      pageTitle={`${atlasConfig.general.appName} studio`}
      title={
        <Text
          as="h1"
          variant={mdMatch ? 'h700' : 'h600'}
          color={isLoggedIn || !atlasConfig.general.appContentFocus ? undefined : 'colorTextMuted'}
          margin={{ top: 2 }}
        >
          {isLoggedIn ? (
            'Ready to create your channel?'
          ) : atlasConfig.general.appContentFocus ? (
            <>
              Your{' '}
              <InlineText variant={mdMatch ? 'h700' : 'h600'} as="p">
                {atlasConfig.general.appContentFocus}
              </InlineText>{' '}
              creator journey starts here
            </>
          ) : (
            'Your creator journey starts here'
          )}
        </Text>
      }
      subtitle={
        <SubTitle
          as="span"
          variant="t300"
          color={isLoggedIn || !atlasConfig.general.appContentFocus ? undefined : 'colorTextMuted'}
        >
          {isLoggedIn ? (
            'Create a channel to upload videos, sell NFTs, make playlists (coming soon), and more!'
          ) : atlasConfig.general.appContentFocus ? (
            <>
              Welcome to {atlasConfig.general.appName}, a video platform focused on{' '}
              <InlineText as="p" variant="t300">
                {atlasConfig.general.appContentFocus}
              </InlineText>{' '}
              content. To create a channel, first set up a free Joystream membership with our simple step-by-step
              wizard.
            </>
          ) : (
            'To create a channel, first set up a free Joystream membership with our simple step-by-step wizard.'
          )}
        </SubTitle>
      }
      specificComponent={
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
      }
      buttons={[
        isLoggedIn
          ? { size: 'large', to: absoluteRoutes.studio.newChannel(), children: 'Create channel' }
          : { size: 'large', onClick: () => setAuthModalOpenName(getCorrectLoginModal()), children: 'Log in' },
        {
          size: 'large',
          variant: 'tertiary',
          to: absoluteRoutes.viewer.index(),
          _textOnly: true,
          children: `Go to ${atlasConfig.general.appName}`,
          icon: <SvgActionPlay />,
        },
      ]}
      type="studio"
      showLegalLinks
    />
  )
}
