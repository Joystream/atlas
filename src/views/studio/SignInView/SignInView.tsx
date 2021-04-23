import { absoluteRoutes } from '@/config/routes'
import React from 'react'
import {
  Header,
  Hero,
  MemberGrid,
  SubTitle,
  Wrapper,
  StyledButton,
  CardWrapper,
  HandleText,
  StyledAvatar,
  IconWrapper,
} from './SignInView.style'
import { SvgGlyphNewChannel } from '@/shared/icons'
import { Multistepper, AccountStep, ExtensionStep, TermsStep } from '@/components'
import { useRouterQuery, useJoystream, useActiveUser } from '@/hooks'
import { useNavigate } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { BasicMembershipFieldsFragment } from '@/api/queries'

const SignInView = () => {
  const navigate = useNavigate()
  const step = Number(useRouterQuery('step'))
  const { setActiveUser, activeUser, setActiveChannel } = useActiveUser()

  const steps = [
    {
      title: 'Add Polkadot plugin',
      element: <ExtensionStep nextStepPath={absoluteRoutes.studio.signIn({ step: '2' })} />,
    },
    {
      title: 'Connect accounts',
      element: <AccountStep nextStepPath={absoluteRoutes.studio.signIn({ step: '3' })} />,
    },
    {
      title: 'Terms & Conditions',
      element: <TermsStep />,
    },
  ]
  const { accounts } = useJoystream()

  const { memberships } = useMemberships(
    {
      where: {
        controllerAccount_in: accounts.map((a) => a.id),
      },
    },
    {
      fetchPolicy: 'network-only',
    }
  )

  const handlePickMembership = async (membership: BasicMembershipFieldsFragment) => {
    await setActiveUser({
      ...activeUser,
      accountId: membership.controllerAccount,
      memberId: membership.id,
    })
    if (membership.channels.length) {
      if (!activeUser.channelId) {
        setActiveChannel(membership.channels[0].id)
      }
      navigate(absoluteRoutes.studio.videos())
    } else {
      navigate(absoluteRoutes.studio.newChannel())
    }
  }

  return (
    <>
      <Wrapper>
        <Header>
          <Hero variant="hero">Sign in</Hero>
          <SubTitle variant="body1" secondary>
            Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
          </SubTitle>
        </Header>

        <MemberGrid>
          {memberships?.map((membership) => (
            <StudioCard
              onClick={() => handlePickMembership(membership)}
              key={membership.id}
              handle={membership.handle}
              avatarUri={membership.avatarUri}
            />
          ))}
        </MemberGrid>
        <StyledButton
          icon={<SvgGlyphNewChannel />}
          size="large"
          variant="secondary"
          to={absoluteRoutes.studio.signIn({ step: '1' })}
        >
          New Member
        </StyledButton>
      </Wrapper>
      <Multistepper
        currentStepIdx={step <= 0 ? 0 : step - 1}
        steps={steps}
        showDialog={step >= 1}
        onExitClick={() => navigate(absoluteRoutes.studio.signIn({ step: '0' }))}
      />
    </>
  )
}

export type StudioCardProps = {
  handle?: string
  follows?: number
  avatarUri?: string | null
  onClick: () => void
}

const StudioCard: React.FC<StudioCardProps> = ({ handle, avatarUri, onClick }) => {
  return (
    <CardWrapper onClick={onClick}>
      {avatarUri ? (
        <StyledAvatar imageUrl={avatarUri} />
      ) : (
        <IconWrapper>
          <SvgGlyphNewChannel />
        </IconWrapper>
      )}
      <HandleText variant="h4">{handle}</HandleText>
    </CardWrapper>
  )
}

export default SignInView
