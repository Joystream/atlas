import React from 'react'
import { useNavigate } from 'react-router'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { SignInStepsStepper } from '@/components/SignInSteps'
import { SvgActionNewChannel } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useUser } from '@/providers/user'

import {
  CardWrapper,
  HandleText,
  Header,
  Hero,
  MemberGrid,
  StyledAvatar,
  StyledButton,
  SubTitle,
  Wrapper,
} from './SignInView.styles'

export const SignInView = () => {
  const navigate = useNavigate()
  const { activeChannelId, setActiveUser, memberships } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)

  const handlePickMembership = async (membership: BasicMembershipFieldsFragment) => {
    const newActiveUser = {
      accountId: membership.controllerAccount,
      memberId: membership.id,
      channelId: activeChannelId,
    }

    if (membership.channels.length) {
      if (!activeChannelId) {
        newActiveUser.channelId = membership.channels[0].id
      }
      setActiveUser(newActiveUser)
      navigate(absoluteRoutes.studio.videos())
    } else {
      setActiveUser(newActiveUser)
      navigate(absoluteRoutes.studio.newChannel())
    }
  }

  return (
    <>
      <Wrapper>
        <Header>
          <Hero variant="h900">Sign in</Hero>
          <SubTitle variant="t300" secondary>
            Select the membership you want to use. Each membership can have an unlimited number of channels and is
            independent of other memberships you control.
          </SubTitle>
        </Header>

        <MemberGrid>
          {memberships?.map((membership) => (
            <MembershipCard
              onClick={() => handlePickMembership(membership)}
              key={membership.id}
              handle={membership.handle}
              avatarUri={membership.avatarUri}
              disabled={nodeConnectionStatus !== 'connected' || internetConnectionStatus !== 'connected'}
            />
          ))}
        </MemberGrid>
        <StyledButton
          disabled={nodeConnectionStatus !== 'connected' || internetConnectionStatus !== 'connected'}
          icon={<SvgActionNewChannel />}
          size="large"
          variant="secondary"
          to={absoluteRoutes.studio.signIn({ step: '1' })}
        >
          New membership
        </StyledButton>
      </Wrapper>
      <SignInStepsStepper />
    </>
  )
}

export type MembershipCardProps = {
  handle?: string
  follows?: number
  avatarUri?: string | null
  onClick: () => void
  disabled?: boolean
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ handle, avatarUri, onClick, disabled }) => {
  return (
    <CardWrapper onClick={onClick} disabled={disabled}>
      <StyledAvatar assetUrl={avatarUri} />
      <HandleText variant="h500">{handle}</HandleText>
    </CardWrapper>
  )
}
